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
    };
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
      // Basic heuristic: if no platform specified, assume IG
      url = `https://www.instagram.com/${handle.replace('@', '')}/`;
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
        stats: {
          likes: metadata.likes || '0',
          comments: metadata.comments || '0',
        },
      };
    } catch (error) {
      console.error('Preview Competitor Error:', error);
      return {
        handle: handle.replace('@', ''),
        name: handle.replace('@', ''),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${handle}`,
        bio: '',
        stats: { likes: '0', comments: '0' },
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

    let url = competitor.handle;
    if (!url.startsWith('http')) {
      if (url.includes('tiktok')) {
        url = `https://www.tiktok.com/@${competitor.handle.replace('@', '')}`;
      } else if (url.includes('youtube') || competitor.handle.startsWith('@')) {
        const handle = competitor.handle.startsWith('@')
          ? competitor.handle
          : `@${competitor.handle.replace('youtube.com/', '').replace('www.', '')}`;
        url = `https://www.youtube.com/${handle}/shorts`;
      } else {
        url = `https://www.instagram.com/${competitor.handle.replace('@', '')}/reels/`;
      }
    } else if (url.includes('youtube.com') && !url.includes('/shorts')) {
      // If it's a full YouTube URL but doesn't target shorts, append it
      url = url.endsWith('/') ? `${url}shorts` : `${url}/shorts`;
    }

    const videos = await scrapeProfileFeed(url, 10);
    const results = [];

    for (const video of videos) {
      // Check if exists by thumbnail or caption to avoid duplicates
      // This is a naive check; ideally we'd have externalId or url in schema.
      const existing = await prisma.competitorPost.findFirst({
        where: {
          competitorId,
          OR: [
            { thumbnailUrl: video.thumbnail },
            { captionExcerpt: video.title?.substring(0, 100) || 'No caption' },
          ],
        },
      });

      if (!existing && video.thumbnail) {
        const post = await prisma.competitorPost.create({
          data: {
            competitorId,
            thumbnailUrl: video.thumbnail,
            captionExcerpt: video.title || video.description || 'No caption',
            postedAt: video.postedAt || new Date(),
            metrics: {
              views: video.views || '0',
              likes: video.likes || '0',
              comments: video.comments || '0',
              url: video.url, // Storing URL in metrics for now
            },
            isViral: false,
          },
        });
        results.push(post);
      }
    }

    // After syncing, return the updated list of posts (up to 10)
    return await prisma.competitorPost.findMany({
      where: { competitorId },
      orderBy: { postedAt: 'desc' },
      take: 10,
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
