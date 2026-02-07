import { prisma } from '../../lib/prisma';
import { Follower, CommunitySummary } from './model';

export class CommunityService {
  private async verifyAccountOwnership(socialAccountId: string, userId: string): Promise<boolean> {
    const account = await prisma.socialAccount.findFirst({
      where: { id: socialAccountId, userId }
    });
    return !!account;
  }

  async getFollowers(userId: string, socialAccountId: string): Promise<any[] | null> {
    const isOwner = await this.verifyAccountOwnership(socialAccountId, userId);
    if (!isOwner) return null;

    const followers = await prisma.follower.findMany({
      where: { socialAccountId },
      include: { interactions: true },
    });

    return followers.map(f => ({
      ...f,
      stats: f.stats as any,
    }));
  }

  async getCommunitySummary(userId: string, socialAccountId: string): Promise<CommunitySummary | null> {
    const isOwner = await this.verifyAccountOwnership(socialAccountId, userId);
    if (!isOwner) return null;

    const totalCount = await prisma.follower.count({ where: { socialAccountId } });
    const vipCount = await prisma.follower.count({
      where: {
        socialAccountId,
        segment: { in: ['VIP', 'Superfan'] }
      }
    });

    return {
      total: totalCount,
      vips: vipCount,
      newThisMonth: 0,
    };
  }
}

export const communityService = new CommunityService();
