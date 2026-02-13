import { prisma } from '../../lib/prisma';
import {
  CreateCompetitorDTO,
  UpdateCompetitorDTO,
  BulkCreateCompetitorDTO,
} from './model';
import { scrapeUrl, scrapeProfileFeed } from '../../lib/scraper';

export class CompetitorsService {
  private formatCompetitor(competitor: any) {
    return {
      ...competitor,
      isFollowing: true,
      // Ensure handle is clean in response if it wasn't already
      handle: competitor.handle.replace('@', ''),
    };
  }

  private getPlatform(url: string): string {
    const lowercaseUrl = url.toLowerCase();
    if (lowercaseUrl.includes('youtube.com')) return 'youtube';
    if (lowercaseUrl.includes('tiktok.com')) return 'tiktok';
    if (lowercaseUrl.includes('instagram.com')) return 'instagram';
    return 'instagram'; // Default
  }

  async getAllCompetitors(
    userId: string,
    watchlistId?: string,
    includePosts?: boolean,
  ) {
    const where: any = { userId };
    if (watchlistId) {
      where.watchlists = {
        some: { id: watchlistId },
      };
    }

    const competitors = await prisma.competitor.findMany({
      where,
      include: {
        watchlists: true,
        posts: includePosts
          ? {
              orderBy: { postedAt: 'desc' },
              take: 10, // Default to 10 latest posts
            }
          : false,
      },
      orderBy: { createdAt: 'desc' },
    });
    return competitors.map((comp) => this.formatCompetitor(comp));
  }

  async getCompetitorById(id: string, userId: string) {
    const competitor = await prisma.competitor.findFirst({
      where: { id, userId },
      include: {
        watchlists: true,
        posts: {
          orderBy: { postedAt: 'desc' },
        },
      },
    });

    if (!competitor) return null;
    return this.formatCompetitor(competitor);
  }

  async previewCompetitor(handle: string) {
    let url = handle;
    if (!handle.startsWith('http')) {
      // If just a handle is provided, we default to Instagram or try to guess
      if (handle.startsWith('@')) {
        url = `https://www.youtube.com/${handle}/shorts`;
      } else {
        url = `https://www.instagram.com/${handle.replace('@', '')}/`;
      }
    }

    try {
      const metadata = await scrapeUrl(url);
      return {
        handle: metadata.handle || handle.replace('@', ''),
        name: metadata.title || metadata.handle || handle.replace('@', ''),
        avatarUrl:
          metadata.thumbnail ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${handle}`,
        bio: metadata.description || '',
        platform: metadata.platform || this.getPlatform(url),
        externalUrl: metadata.externalUrl || url,
        originUrl: url,
        stats: {
          likes: metadata.likes || '0',
          comments: metadata.comments || '0',
          followers: metadata.followers || '0',
          following: metadata.following || '0',
        },
      };
    } catch (error) {
      console.error('Preview Competitor Error:', error);
      const cleanHandle = handle.replace('@', '');
      const platform = this.getPlatform(url);
      return {
        handle: cleanHandle,
        name: cleanHandle,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanHandle}`,
        bio: '',
        platform,
        externalUrl: url,
        originUrl: url,
        stats: { likes: '0', comments: '0', followers: '0', following: '0' },
      };
    }
  }

  async createCompetitor(userId: string, data: CreateCompetitorDTO) {
    const { watchlistIds, ...competitorData } = data;

    const competitor = await prisma.competitor.create({
      data: {
        ...competitorData,
        avatarUrl:
          competitorData.avatarUrl ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${competitorData.handle}`,
        tags: competitorData.tags || [],
        stats: competitorData.stats || {},
        userId,
        watchlists: watchlistIds
          ? {
              connect: watchlistIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        watchlists: true,
      },
    });

    // Trigger initial sync in background
    this.syncCompetitorVideos(competitor.id, userId).catch((err) => {
      console.error(`Failed to initial sync for ${competitor.handle}:`, err);
    });

    return this.formatCompetitor(competitor);
  }

  async bulkCreateCompetitors(userId: string, data: BulkCreateCompetitorDTO) {
    const results = [];
    for (const handle of data.handles) {
      try {
        const preview = await this.previewCompetitor(handle);
        const competitor = await this.createCompetitor(userId, {
          handle: preview.handle,
          name: preview.name,
          avatarUrl: preview.avatarUrl,
          bio: preview.bio,
          platform: preview.platform,
          externalUrl: preview.externalUrl,
          originUrl: preview.originUrl,
          stats: preview.stats,
          tags: data.tags,
          socialAccountId: data.socialAccountId,
          watchlistIds: data.watchlistId ? [data.watchlistId] : undefined,
        });
        results.push(competitor);
      } catch (error) {
        console.error(
          `Failed to create competitor for handle ${handle}:`,
          error,
        );
      }
    }
    return results;
  }

  async updateCompetitor(
    id: string,
    userId: string,
    data: UpdateCompetitorDTO,
  ) {
    const competitor = await prisma.competitor.findFirst({
      where: { id, userId },
    });

    if (!competitor) return null;

    const { watchlistIds, ...updateData } = data;

    const updatedComp = await prisma.competitor.update({
      where: { id },
      data: {
        ...updateData,
        watchlists: watchlistIds
          ? {
              set: watchlistIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        watchlists: true,
      },
    });
    return this.formatCompetitor(updatedComp);
  }

  async deleteCompetitor(id: string, userId: string) {
    const competitor = await prisma.competitor.findFirst({
      where: { id, userId },
    });

    if (!competitor) return false;

    await prisma.competitor.delete({
      where: { id },
    });
    return true;
  }

  async syncCompetitorVideos(competitorId: string, userId: string) {
    const competitor = await prisma.competitor.findFirst({
      where: { id: competitorId, userId },
    });

    if (!competitor) throw new Error('Competitor not found');

    // Use the reliable externalUrl for syncing
    let url = competitor.externalUrl;

    // Platform specific path additions if needed
    if (competitor.platform === 'youtube' && !url.includes('/shorts')) {
      url = url.endsWith('/') ? `${url}shorts` : `${url}/shorts`;
    } else if (competitor.platform === 'instagram' && !url.includes('/reels')) {
      url = url.endsWith('/') ? `${url}reels/` : `${url}/reels/`;
    }

    const videos = await scrapeProfileFeed(url, 10);
    const results = [];

    for (const video of videos) {
      // Use the video URL as the unique external identification
      const externalUrl = video.url;

      try {
        const post = await prisma.competitorPost.upsert({
          where: {
            competitorId_externalUrl: {
              competitorId,
              externalUrl,
            },
          },
          update: {
            metrics: {
              views: video.views || '0',
              likes: video.likes || '0',
              comments: video.comments || '0',
              url: video.url,
            },
          },
          create: {
            competitorId,
            externalUrl,
            thumbnailUrl: video.thumbnail || '',
            captionExcerpt: video.title || video.description || 'No caption',
            postedAt: video.postedAt || new Date(),
            metrics: {
              views: video.views || '0',
              likes: video.likes || '0',
              comments: video.comments || '0',
              url: video.url,
            },
            isViral: false,
          },
        });
        results.push(post);
      } catch (error) {
        console.error(`Failed to upsert video ${externalUrl}:`, error);
      }
    }

    // After syncing, return the updated list of posts (up to 10)
    return await prisma.competitorPost.findMany({
      where: { competitorId },
      orderBy: { postedAt: 'desc' },
      take: 10,
    });
  }

  // Creator Management
  async getCreators(userId: string) {
    return prisma.creator.findMany({
      where: { userId },
      include: {
        competitors: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async getCreatorById(id: string, userId: string) {
    return prisma.creator.findFirst({
      where: { id, userId },
      include: {
        competitors: {
          include: {
            posts: {
              orderBy: { postedAt: 'desc' },
              take: 5,
            },
          },
        },
      },
    });
  }

  async createCreator(userId: string, name: string) {
    return prisma.creator.create({
      data: {
        name,
        userId,
      },
    });
  }

  async linkCompetitorToCreator(
    competitorId: string,
    creatorId: string,
    userId: string,
  ) {
    // Verify ownership
    const competitor = await prisma.competitor.findFirst({
      where: { id: competitorId, userId },
    });
    const creator = await prisma.creator.findFirst({
      where: { id: creatorId, userId },
    });

    if (!competitor || !creator) {
      throw new Error('Competitor or Creator not found or not owned by user');
    }

    return prisma.competitor.update({
      where: { id: competitorId },
      data: { creatorId },
    });
  }

  async unlinkCompetitorFromCreator(competitorId: string, userId: string) {
    const competitor = await prisma.competitor.findFirst({
      where: { id: competitorId, userId },
    });

    if (!competitor) {
      throw new Error('Competitor not found');
    }

    return prisma.competitor.update({
      where: { id: competitorId },
      data: { creatorId: null },
    });
  }

  async syncAllCompetitors(userId: string) {
    const competitors = await this.getAllCompetitors(userId);
    const results = [];
    for (const comp of competitors) {
      try {
        const videos = await this.syncCompetitorVideos(comp.id, userId);
        results.push(...videos);
      } catch (e) {
        console.error(`Failed to sync competitor ${comp.handle}`, e);
      }
    }
    return results;
  }
}

export const competitorsService = new CompetitorsService();
