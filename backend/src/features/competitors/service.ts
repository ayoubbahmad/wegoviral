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

  async getAllCompetitors(userId: string) {
    const competitors = await prisma.competitor.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return competitors.map((comp) => this.formatCompetitor(comp));
  }

  async getCompetitorById(id: string, userId: string) {
    const competitor = await prisma.competitor.findFirst({
      where: { id, userId },
      include: {
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
    const competitor = await prisma.competitor.create({
      data: {
        handle: data.handle,
        name: data.name,
        avatarUrl:
          data.avatarUrl ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.handle}`,
        bio: data.bio,
        tags: data.tags || [],
        stats: data.stats || {},
        userId,
        socialAccountId: data.socialAccountId,
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

    const updatedComp = await prisma.competitor.update({
      where: { id },
      data,
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
