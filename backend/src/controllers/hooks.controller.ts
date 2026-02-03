import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const MOCK_USER_ID = 'mock-user-1';

// Helper function to ensure user exists
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

export const getHooks = async (req: Request, res: Response) => {
    try {
        await ensureUserExists();
        const hooks = await prisma.hook.findMany({
            where: { userId: MOCK_USER_ID },
            orderBy: { createdAt: 'desc' },
        });
        res.json(hooks.map(hook => ({
            ...hook,
            addedAt: hook.createdAt.toISOString(),
            lastUsed: hook.lastUsed?.toISOString(),
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hooks' });
    }
};

export const createHook = async (req: Request, res: Response) => {
    try {
        await ensureUserExists();
        const data = req.body;
        const hook = await prisma.hook.create({
            data: {
                ...data,
                userId: MOCK_USER_ID,
            },
        });
        res.status(201).json(hook);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create hook' });
    }
};

export const deleteHook = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.hook.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete hook' });
    }
};
