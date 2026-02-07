import { Response } from 'express';
import { performanceService } from './service';

export const getUserPosts = async (req: any, res: Response) => {
    try {
        const { socialAccountId } = req.query;
        if (!socialAccountId) return res.status(400).json({ error: 'socialAccountId is required' });

        const posts = await performanceService.getUserPosts(req.user.id, String(socialAccountId));
        
        if (posts === null) {
            return res.status(403).json({ error: 'Unauthorized access to this social account' });
        }

        res.json(posts);
    } catch (error) {
        console.error('Get User Posts Error:', error);
        res.status(500).json({ error: 'Failed to fetch user posts' });
    }
};

export const getPerformanceInsights = async (req: any, res: Response) => {
    try {
        const { socialAccountId } = req.query;
        if (!socialAccountId) return res.status(400).json({ error: 'socialAccountId is required' });

        const insights = await performanceService.getPerformanceInsights(req.user.id, String(socialAccountId));

        if (insights === null) {
            return res.status(403).json({ error: 'Unauthorized access to this social account' });
        }

        res.json(insights);
    } catch (error) {
        console.error('Get Performance Insights Error:', error);
        res.status(500).json({ error: 'Failed to fetch performance insights' });
    }
};
