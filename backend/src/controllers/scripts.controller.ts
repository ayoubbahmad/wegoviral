import { Response } from 'express';
import { prisma } from '../lib/prisma';

export const getScripts = async (req: any, res: Response) => {
    try {
        const scripts = await prisma.scriptTemplate.findMany({
            where: { userId: req.user.id },
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

export const createScript = async (req: any, res: Response) => {
    try {
        const { title, content, category, socialAccountId } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content structure are required' });
        }

        const script = await prisma.scriptTemplate.create({
            data: {
                title,
                content,
                category: category || 'General',
                userId: req.user.id,
            },
        });
        res.status(201).json({
            ...script,
            createdAt: script.createdAt.toISOString(),
        });
    } catch (error: any) {
        console.error('Create Script Error:', error);
        res.status(500).json({ error: 'Failed to create script', details: error.message });
    }
};

export const updateScript = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;
        const data = req.body;

        // Ensure user owns the script
        const script = await prisma.scriptTemplate.findFirst({
            where: { id, userId: req.user.id }
        });

        if (!script) {
            return res.status(404).json({ error: 'Script not found' });
        }

        const updatedScript = await prisma.scriptTemplate.update({
            where: { id },
            data,
        });
        res.json(updatedScript);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update script template' });
    }
};

export const deleteScript = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;

        // Ensure user owns the script
        const script = await prisma.scriptTemplate.findFirst({
            where: { id, userId: req.user.id }
        });

        if (!script) {
            return res.status(404).json({ error: 'Script not found' });
        }

        await prisma.scriptTemplate.delete({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete script' });
    }
};
