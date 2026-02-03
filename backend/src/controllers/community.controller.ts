import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getFollowers = async (req: Request, res: Response) => {
    try {
        const { socialAccountId } = req.query;
        if (!socialAccountId) return res.status(400).json({ error: 'socialAccountId is required' });

        const followers = await prisma.follower.findMany({
            where: { socialAccountId: String(socialAccountId) },
            include: { interactions: true },
        });

        res.json(followers.map(f => ({
            ...f,
            stats: f.stats as any,
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch followers' });
    }
};

export const getCommunitySummary = async (req: Request, res: Response) => {
    try {
        const { socialAccountId } = req.query;
        if (!socialAccountId) return res.status(400).json({ error: 'socialAccountId is required' });

        const totalCount = await prisma.follower.count({ where: { socialAccountId: String(socialAccountId) } });
        const vipCount = await prisma.follower.count({
            where: {
                socialAccountId: String(socialAccountId),
                segment: { in: ['VIP', 'Superfan'] }
            }
        });

        res.json({
            total: totalCount,
            vips: vipCount,
            newThisMonth: 0,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch community summary' });
    }
};
