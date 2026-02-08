import { Response } from 'express';
import { homeService } from './service';

export const getHomeSummary = async (req: any, res: Response) => {
    try {
        const summary = await homeService.getHomeSummary(req.user.id);
        res.json(summary);
    } catch (error) {
        console.error('Get Home Summary Error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard summary' });
    }
};
