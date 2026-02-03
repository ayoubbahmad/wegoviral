import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const MOCK_USER_ID = 'mock-user-1';

async function ensureUserExists() {
    const existingUser = await prisma.userProfile.findUnique({
        where: { id: MOCK_USER_ID },
    });

    if (!existingUser) {
        await prisma.userProfile.create({
            data: {
                id: MOCK_USER_ID,
                email: 'mock@example.com',
                username: 'demo_creator',
                passwordHash: 'dummy_hash',
                name: 'Demo Creator',
            },
        });
    }
}

export const getCompetitors = async (req: Request, res: Response) => {
    try {
        await ensureUserExists();
        const competitors = await prisma.competitor.findMany({
            where: { userId: MOCK_USER_ID },
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

export const createCompetitor = async (req: Request, res: Response) => {
    try {
        await ensureUserExists();
        const data = req.body;
        const competitor = await prisma.competitor.create({
            data: {
                ...data,
                userId: MOCK_USER_ID,
            },
        });
        res.status(201).json(competitor);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create competitor' });
    }
};

export const deleteCompetitor = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.competitor.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete competitor' });
    }
};
