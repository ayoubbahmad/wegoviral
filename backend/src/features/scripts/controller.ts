import { Response } from 'express';
import { prisma } from '../../lib/prisma';

// Helper to calculate word count from script content
const calculateWordCount = (content: any): number => {
    if (!content || !content.generatedContent) return 0;
    return content.generatedContent.trim().split(/\s+/).length;
};

// Helper to generate excerpt
const generateExcerpt = (content: any): string => {
    if (!content || !content.generatedContent) return '';
    const text = content.generatedContent.replace(/\n+/g, ' ').trim();
    return text.length > 120 ? text.substring(0, 117) + '...' : text;
};

export const getScripts = async (req: any, res: Response) => {
    try {
        const scripts = await prisma.scriptTemplate.findMany({
            where: { userId: req.user.id },
            orderBy: { updatedAt: 'desc' },
        });
        
        res.json(scripts.map(s => ({
            ...s,
            lastUpdated: s.updatedAt.toISOString(),
            wordCount: s.wordCount || calculateWordCount(s.content),
            excerpt: s.excerpt || generateExcerpt(s.content),
            status: s.status || 'Draft'
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scripts' });
    }
};

export const getScript = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;
        const script = await prisma.scriptTemplate.findFirst({
            where: { id, userId: req.user.id }
        });

        if (!script) {
            return res.status(404).json({ error: 'Script not found' });
        }

        res.json({
            ...script,
            lastUpdated: script.updatedAt.toISOString(),
            wordCount: script.wordCount || calculateWordCount(script.content),
            excerpt: script.excerpt || generateExcerpt(script.content),
            status: script.status || 'Draft'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch script' });
    }
};

export const createScript = async (req: any, res: Response) => {
    try {
        const { title, content, category } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content structure are required' });
        }

        const wordCount = calculateWordCount(content);
        const excerpt = generateExcerpt(content);

        const script = await prisma.scriptTemplate.create({
            data: {
                title,
                content,
                category: category || 'General',
                status: 'Completed', // Defaulting to completed since it's generated
                excerpt,
                wordCount,
                userId: req.user.id,
            },
        });
        
        res.status(201).json({
            ...script,
            lastUpdated: script.updatedAt.toISOString(),
        });
    } catch (error: any) {
        console.error('Create Script Error:', error);
        res.status(500).json({ error: 'Failed to create script', details: error.message });
    }
};

export const updateScript = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;
        const { title, content, category, status } = req.body;

        // Ensure user owns the script
        const existingScript = await prisma.scriptTemplate.findFirst({
            where: { id, userId: req.user.id }
        });

        if (!existingScript) {
            return res.status(404).json({ error: 'Script not found' });
        }

        const wordCount = content ? calculateWordCount(content) : existingScript.wordCount;
        const excerpt = content ? generateExcerpt(content) : existingScript.excerpt;

        const updatedScript = await prisma.scriptTemplate.update({
            where: { id },
            data: {
                title,
                content,
                category,
                status,
                excerpt,
                wordCount,
            },
        });

        res.json({
            ...updatedScript,
            lastUpdated: updatedScript.updatedAt.toISOString(),
        });
    } catch (error) {
        console.error('Update Script Error:', error);
        res.status(500).json({ error: 'Failed to update script' });
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
