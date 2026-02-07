import { Response } from 'express';
import { competitorsService } from './service';

export const getCompetitors = async (req: any, res: Response) => {
    try {
        const competitors = await competitorsService.getAllCompetitors(req.user.id);
        res.json(competitors);
    } catch (error) {
        console.error('Get Competitors Error:', error);
        res.status(500).json({ error: 'Failed to fetch competitors' });
    }
};

export const getCompetitor = async (req: any, res: Response) => {
    try {
        const competitor = await competitorsService.getCompetitorById(req.params.id, req.user.id);
        if (!competitor) {
            return res.status(404).json({ error: 'Competitor not found' });
        }
        res.json(competitor);
    } catch (error) {
        console.error('Get Competitor Error:', error);
        res.status(500).json({ error: 'Failed to fetch competitor' });
    }
};

export const createCompetitor = async (req: any, res: Response) => {
    try {
        const { handle, name, avatarUrl, bio, tags, stats, socialAccountId } = req.body;
        if (!handle || !name) {
            return res.status(400).json({ error: 'Handle and name are required' });
        }

        const competitor = await competitorsService.createCompetitor(req.user.id, {
            handle, name, avatarUrl, bio, tags, stats, socialAccountId
        });
        res.status(201).json(competitor);
    } catch (error: any) {
        console.error('Create Competitor Error:', error);
        res.status(500).json({ error: 'Failed to create competitor', details: error.message });
    }
};

export const updateCompetitor = async (req: any, res: Response) => {
    try {
        const competitor = await competitorsService.updateCompetitor(req.params.id, req.user.id, req.body);
        if (!competitor) {
            return res.status(404).json({ error: 'Competitor not found' });
        }
        res.json(competitor);
    } catch (error) {
        console.error('Update Competitor Error:', error);
        res.status(500).json({ error: 'Failed to update competitor' });
    }
};

export const deleteCompetitor = async (req: any, res: Response) => {
    try {
        const success = await competitorsService.deleteCompetitor(req.params.id, req.user.id);
        if (!success) {
            return res.status(404).json({ error: 'Competitor not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Delete Competitor Error:', error);
        res.status(500).json({ error: 'Failed to delete competitor' });
    }
};
