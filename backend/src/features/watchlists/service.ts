import { prisma } from '../../lib/prisma';
import { CreateWatchlistDTO, UpdateWatchlistDTO } from './model';

export class WatchlistService {
  async getAllWatchlists(userId: string) {
    return prisma.watchlist.findMany({
      where: { userId },
      include: {
        _count: {
          select: { competitors: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getWatchlistById(id: string, userId: string) {
    return prisma.watchlist.findFirst({
      where: { id, userId },
      include: {
        competitors: true,
      },
    });
  }

  async createWatchlist(userId: string, data: CreateWatchlistDTO) {
    return prisma.watchlist.create({
      data: {
        name: data.name,
        userId,
      },
    });
  }

  async updateWatchlist(id: string, userId: string, data: UpdateWatchlistDTO) {
    return prisma.watchlist.update({
      where: { id, userId },
      data,
    });
  }

  async deleteWatchlist(id: string, userId: string) {
    await prisma.watchlist.delete({
      where: { id, userId },
    });
    return true;
  }

  async addCompetitorToWatchlist(
    watchlistId: string,
    competitorId: string,
    userId: string,
  ) {
    return prisma.watchlist.update({
      where: { id: watchlistId, userId },
      data: {
        competitors: {
          connect: { id: competitorId },
        },
      },
    });
  }

  async removeCompetitorFromWatchlist(
    watchlistId: string,
    competitorId: string,
    userId: string,
  ) {
    return prisma.watchlist.update({
      where: { id: watchlistId, userId },
      data: {
        competitors: {
          disconnect: { id: competitorId },
        },
      },
    });
  }
}

export const watchlistService = new WatchlistService();
