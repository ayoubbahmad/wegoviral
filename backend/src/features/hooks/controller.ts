import { Response } from 'express';
import { hooksService } from './service';

export const getHooks = async (req: any, res: Response) => {
    try {
        const hooks = await hooksService.getAllHooks(req.user.id);
        res.json(hooks);
    } catch (error) {
        console.error('Get Hooks Error:', error);
        res.status(500).json({ error: 'Failed to fetch hooks' });
    }
};

export const createHook = async (req: any, res: Response) => {
    try {
        const { content, type, emotion, topic, performanceRating, socialAccountId } = req.body;
        if (!content || !type) {
            return res.status(400).json({ error: 'Content and type are required' });
        }

        const hook = await hooksService.createHook(req.user.id, {
            content, type, emotion, topic, performanceRating, socialAccountId
        });
        res.status(201).json(hook);
    } catch (error: any) {
        console.error('Create Hook Error:', error);
        res.status(500).json({ error: 'Failed to create hook', details: error.message });
    }
};

export const updateHook = async (req: any, res: Response) => {
    try {
        const hook = await hooksService.updateHook(req.params.id, req.user.id, req.body);
        if (!hook) {
            return res.status(404).json({ error: 'Hook not found' });
        }
        res.json(hook);
    } catch (error) {
        console.error('Update Hook Error:', error);
        res.status(500).json({ error: 'Failed to update hook' });
    }
};

export const deleteHook = async (req: any, res: Response) => {
    try {
        const success = await hooksService.deleteHook(req.params.id, req.user.id);
        if (!success) {
            return res.status(404).json({ error: 'Hook not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Delete Hook Error:', error);
        res.status(500).json({ error: 'Failed to delete hook' });
    }
};
