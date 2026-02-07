import { Response } from 'express';
import { prisma } from '../../lib/prisma';

export const getUserPosts = async (req: any, res: Response) => {
    try {
        const { socialAccountId } = req.query;
        if (!socialAccountId) return res.status(400).json({ error: 'socialAccountId is required' });

        // Ensure user owns this social account
        const account = await prisma.socialAccount.findFirst({
            where: { id: String(socialAccountId), userId: req.user.id }
        });

        if (!account) {
            return res.status(403).json({ error: 'Unauthorized access to this social account' });
        }

        const posts = await prisma.userPost.findMany({
            where: { socialAccountId: String(socialAccountId) },
            orderBy: { postedAt: 'desc' },
        });

        res.json(posts.map(p => ({
            ...p,
            postedAt: p.postedAt.toISOString(),
            metrics: p.metrics as any,
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user posts' });
    }
};

export const getPerformanceInsights = async (req: any, res: Response) => {
    try {
        const { socialAccountId } = req.query;
        if (!socialAccountId) return res.status(400).json({ error: 'socialAccountId is required' });

        // Ensure user owns this social account
        const account = await prisma.socialAccount.findFirst({
            where: { id: String(socialAccountId), userId: req.user.id }
        });

        if (!account) {
            return res.status(403).json({ error: 'Unauthorized access to this social account' });
        }

        // Mocking for now as in the original server action
        res.json({
            bestTime: "Tuesday at 6 PM",
            contentMix: [
                { label: "Reels", value: 60, color: "bg-blue-500" },
                { label: "Carousels", value: 30, color: "bg-purple-500" },
            ]
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch performance insights' });
    }
};
