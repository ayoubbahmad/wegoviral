import { Response } from 'express';
import { prisma } from '../lib/prisma';

export const getHooks = async (req: any, res: Response) => {
    try {
        const hooks = await prisma.hook.findMany({
            where: { userId: req.user.id },
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

export const createHook = async (req: any, res: Response) => {
    try {
        const data = req.body;
        const hook = await prisma.hook.create({
            data: {
                ...data,
                userId: req.user.id,
            },
        });
        res.status(201).json(hook);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create hook' });
    }
};

export const deleteHook = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;

        // Ensure user owns the hook
        const hook = await prisma.hook.findFirst({
            where: { id, userId: req.user.id }
        });

        if (!hook) {
            return res.status(404).json({ error: 'Hook not found' });
        }

        await prisma.hook.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete hook' });
    }
};
