import { Response } from 'express';
import { scriptsService } from './service';

export const getScripts = async (req: any, res: Response) => {
    try {
        const scripts = await scriptsService.getAllScripts(req.user.id);
        res.json(scripts);
    } catch (error) {
        console.error('Get Scripts Error:', error);
        res.status(500).json({ error: 'Failed to fetch scripts' });
    }
};

export const getScript = async (req: any, res: Response) => {
    try {
        const script = await scriptsService.getScriptById(req.params.id, req.user.id);
        if (!script) {
            return res.status(404).json({ error: 'Script not found' });
        }
        res.json(script);
    } catch (error) {
        console.error('Get Script Error:', error);
        res.status(500).json({ error: 'Failed to fetch script' });
    }
};

export const createScript = async (req: any, res: Response) => {
    try {
        const { title, content, category } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content structure are required' });
        }

        const script = await scriptsService.createScript(req.user.id, { title, content, category });
        res.status(201).json(script);
    } catch (error: any) {
        console.error('Create Script Error:', error);
        res.status(500).json({ error: 'Failed to create script', details: error.message });
    }
};

export const updateScript = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;
        const script = await scriptsService.updateScript(id, req.user.id, req.body);
        
        if (!script) {
            return res.status(404).json({ error: 'Script not found' });
        }

        res.json(script);
    } catch (error) {
        console.error('Update Script Error:', error);
        res.status(500).json({ error: 'Failed to update script' });
    }
};

export const deleteScript = async (req: any, res: Response) => {
    try {
        const success = await scriptsService.deleteScript(req.params.id, req.user.id);
        if (!success) {
            return res.status(404).json({ error: 'Script not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Delete Script Error:', error);
        res.status(500).json({ error: 'Failed to delete script' });
    }
};
