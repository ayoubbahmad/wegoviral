import { prisma } from '../../lib/prisma';
import { UserPost, PerformanceInsights } from './model';

export class PerformanceService {
  private async verifyAccountOwnership(socialAccountId: string, userId: string): Promise<boolean> {
    const account = await prisma.socialAccount.findFirst({
      where: { id: socialAccountId, userId }
    });
    return !!account;
  }

  async getUserPosts(userId: string, socialAccountId: string): Promise<any[] | null> {
    const isOwner = await this.verifyAccountOwnership(socialAccountId, userId);
    if (!isOwner) return null;

    const posts = await prisma.userPost.findMany({
      where: { socialAccountId },
      orderBy: { postedAt: 'desc' },
    });

    return posts.map(p => ({
      ...p,
      postedAt: p.postedAt.toISOString(),
      metrics: p.metrics as any,
    }));
  }

  async getPerformanceInsights(userId: string, socialAccountId: string): Promise<PerformanceInsights | null> {
    const isOwner = await this.verifyAccountOwnership(socialAccountId, userId);
    if (!isOwner) return null;

    // Mocking insights logic for now
    return {
      bestTime: "Tuesday at 6 PM",
      contentMix: [
        { label: "Reels", value: 60, color: "bg-blue-500" },
        { label: "Carousels", value: 30, color: "bg-purple-500" },
      ]
    };
  }
}

export const performanceService = new PerformanceService();
