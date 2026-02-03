import { Response } from 'express';
import { prisma } from '../lib/prisma';

export const getCompetitors = async (req: any, res: Response) => {
    try {
        const competitors = await prisma.competitor.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(competitors.map(comp => ({
            ...comp,
            isFollowing: true,
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch competitors' });
    }
};

export const createCompetitor = async (req: any, res: Response) => {
    try {
        const data = req.body;
        const competitor = await prisma.competitor.create({
            data: {
                ...data,
                userId: req.user.id,
            },
        });
        res.status(201).json(competitor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create competitor' });
    }
};

export const updateCompetitor = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;
        const data = req.body;

        // Ensure user owns the competitor
        const competitor = await prisma.competitor.findFirst({
            where: { id, userId: req.user.id }
        });

        if (!competitor) {
            return res.status(404).json({ error: 'Competitor not found' });
        }

        const updatedComp = await prisma.competitor.update({
            where: { id },
            data,
        });
        res.json(updatedComp);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update competitor' });
    }
};

export const deleteCompetitor = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;

        // Ensure user owns the competitor
        const competitor = await prisma.competitor.findFirst({
            where: { id, userId: req.user.id }
        });

        if (!competitor) {
            return res.status(404).json({ error: 'Competitor not found' });
        }

        await prisma.competitor.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete competitor' });
    }
};
