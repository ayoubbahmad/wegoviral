'use server';

import { prisma } from '@/lib/prisma';

export async function getUserPosts(socialAccountId: string) {
    try {
        const posts = await prisma.userPost.findMany({
            where: { socialAccountId },
            orderBy: { postedAt: 'desc' },
        });

        return posts.map(p => ({
            id: p.id,
            thumbnailUrl: p.thumbnailUrl,
            caption: p.caption,
            postedAt: p.postedAt.toISOString(),
            metrics: p.metrics as any,
        }));
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return [];
    }
}

export async function getPerformanceInsights(socialAccountId: string) {
    // In a real app, this would perform aggregations
    // For now, return structured data that can be used by the UI
    return {
        bestTime: "Tuesday at 6 PM",
        contentMix: [
            { label: "Reels", value: 60, color: "bg-blue-500" },
            { label: "Carousels", value: 30, color: "bg-purple-500" },
        ]
    };
}
