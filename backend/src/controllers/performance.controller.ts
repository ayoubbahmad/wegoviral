import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getUserPosts = async (req: Request, res: Response) => {
    try {
        const { socialAccountId } = req.query;
        if (!socialAccountId) return res.status(400).json({ error: 'socialAccountId is required' });

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

export const getPerformanceInsights = async (req: Request, res: Response) => {
    try {
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
