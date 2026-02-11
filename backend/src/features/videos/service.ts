import { prisma } from '../../lib/prisma';

export class VideosService {
  async getAllVideos(userId: string, watchlistId?: string, limit = 50) {
    const where: any = {
      competitor: {
        userId,
      },
    };

    if (watchlistId) {
      where.competitor.watchlists = {
        some: { id: watchlistId },
      };
    }

    return await prisma.competitorPost.findMany({
      where,
      include: {
        competitor: true,
      },
      orderBy: { postedAt: 'desc' },
      take: limit,
    });
  }
}

export const videosService = new VideosService();
