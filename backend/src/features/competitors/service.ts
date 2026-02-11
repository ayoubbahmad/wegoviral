import { prisma } from '../../lib/prisma';
import {
  CreateCompetitorDTO,
  UpdateCompetitorDTO,
  BulkCreateCompetitorDTO,
} from './model';
import { scrapeUrl } from '../../lib/scraper';

export class CompetitorsService {
  private formatCompetitor(competitor: any) {
    return {
      ...competitor,
      isFollowing: true,
    };
  }

  async getAllCompetitors(userId: string, watchlistId?: string) {
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
}

export const competitorsService = new CompetitorsService();
