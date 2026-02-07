import { Response } from 'express';
import { prisma } from '../../lib/prisma';

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
        const { content, type, emotion, topic, performanceRating, socialAccountId } = req.body;

        if (!content || !type) {
            return res.status(400).json({ error: 'Content and type are required' });
        }

        const hook = await prisma.hook.create({
            data: {
                content,
                type,
                emotion: emotion || 'Neutral',
                topic: topic || 'General',
                performanceRating: performanceRating || 0,
                userId: req.user.id,
                socialAccountId
            },
        });
        res.status(201).json({
            ...hook,
            addedAt: hook.createdAt.toISOString(),
            lastUsed: hook.lastUsed?.toISOString(),
        });
    } catch (error: any) {
        console.error('Create Hook Error:', error);
        res.status(500).json({ error: 'Failed to create hook', details: error.message });
    }
};

export const updateHook = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;
        const data = req.body;

        // Ensure user owns the hook
        const hook = await prisma.hook.findFirst({
            where: { id, userId: req.user.id }
        });

        if (!hook) {
            return res.status(404).json({ error: 'Hook not found' });
        }

        const updatedHook = await prisma.hook.update({
            where: { id },
            data,
        });
        res.json(updatedHook);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update hook' });
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
