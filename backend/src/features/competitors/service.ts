import { prisma } from '../../lib/prisma';
import { CreateCompetitorDTO, UpdateCompetitorDTO } from './model';

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
    return competitors.map(comp => this.formatCompetitor(comp));
  }

  async getCompetitorById(id: string, userId: string) {
    const competitor = await prisma.competitor.findFirst({
      where: { id, userId },
      include: {
        posts: {
          orderBy: { postedAt: 'desc' }
        }
      }
    });

    if (!competitor) return null;
    return this.formatCompetitor(competitor);
  }

  async createCompetitor(userId: string, data: CreateCompetitorDTO) {
    const competitor = await prisma.competitor.create({
      data: {
        handle: data.handle,
        name: data.name,
        avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.handle}`,
        bio: data.bio,
        tags: data.tags || [],
        stats: data.stats || {},
        userId,
        socialAccountId: data.socialAccountId
      },
    });
    return this.formatCompetitor(competitor);
  }

  async updateCompetitor(id: string, userId: string, data: UpdateCompetitorDTO) {
    const competitor = await prisma.competitor.findFirst({
      where: { id, userId }
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
      where: { id, userId }
    });

    if (!competitor) return false;

    await prisma.competitor.delete({
      where: { id },
    });
    return true;
  }
}

export const competitorsService = new CompetitorsService();
