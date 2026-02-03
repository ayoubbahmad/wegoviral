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

export const getScripts = async (req: Request, res: Response) => {
    try {
        await ensureUserExists();
        const scripts = await prisma.scriptTemplate.findMany({
            where: { userId: MOCK_USER_ID },
            orderBy: { createdAt: 'desc' },
        });
        res.json(scripts.map(s => ({
            ...s,
            createdAt: s.createdAt.toISOString(),
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scripts' });
    }
};

export const createScript = async (req: Request, res: Response) => {
    try {
        await ensureUserExists();
        const data = req.body;
        const script = await prisma.scriptTemplate.create({
            data: {
                ...data,
                userId: MOCK_USER_ID,
            },
        });
        res.status(201).json(script);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create script' });
    }
};

export const deleteScript = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.scriptTemplate.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete script' });
    }
};
