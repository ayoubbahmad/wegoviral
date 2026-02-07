import { Response } from 'express';
import { communityService } from './service';

export const getFollowers = async (req: any, res: Response) => {
    try {
        const { socialAccountId } = req.query;
        if (!socialAccountId) return res.status(400).json({ error: 'socialAccountId is required' });

        const followers = await communityService.getFollowers(req.user.id, String(socialAccountId));
        
        if (followers === null) {
            return res.status(403).json({ error: 'Unauthorized access to this social account' });
        }

        res.json(followers);
    } catch (error) {
        console.error('Get Followers Error:', error);
        res.status(500).json({ error: 'Failed to fetch followers' });
    }
};

export const getCommunitySummary = async (req: any, res: Response) => {
    try {
        const { socialAccountId } = req.query;
        if (!socialAccountId) return res.status(400).json({ error: 'socialAccountId is required' });

        const summary = await communityService.getCommunitySummary(req.user.id, String(socialAccountId));

        if (summary === null) {
            return res.status(403).json({ error: 'Unauthorized access to this social account' });
        }

        res.json(summary);
    } catch (error) {
        console.error('Get Community Summary Error:', error);
        res.status(500).json({ error: 'Failed to fetch community summary' });
    }
};
