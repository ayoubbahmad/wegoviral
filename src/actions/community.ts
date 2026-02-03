'use server';

import { prisma } from '@/lib/prisma';

const MOCK_USER_ID = 'mock-user-1';

export async function getFollowers(socialAccountId: string) {
    try {
        const followers = await prisma.follower.findMany({
            where: { socialAccountId },
            include: { interactions: true },
        });

        return followers.map(f => ({
            id: f.id,
            handle: f.handle,
            name: f.name,
            avatarUrl: f.avatarUrl,
            segment: f.segment,
            stats: f.stats as any,
            interactions: f.interactions
        }));
    } catch (error) {
        console.error('Error fetching followers:', error);
        return [];
    }
}

export async function getCommunitySummary(socialAccountId: string) {
    try {
        const totalCount = await prisma.follower.count({ where: { socialAccountId } });
        const vipCount = await prisma.follower.count({
            where: {
                socialAccountId,
                segment: { in: ['VIP', 'Superfan'] }
            }
        });

        // This is a simplification for V1
        return {
            total: totalCount,
            vips: vipCount,
            newThisMonth: 0, // Logic to be added
        };
    } catch (error) {
        console.error('Error fetching community summary:', error);
        return { total: 0, vips: 0, newThisMonth: 0 };
    }
}
