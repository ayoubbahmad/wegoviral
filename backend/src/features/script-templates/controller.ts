import { Response } from 'express';
import { scriptTemplatesService } from './service';

export const getScriptTemplates = async (req: any, res: Response) => {
    try {
        const scripts = await scriptTemplatesService.getAllScripts(req.user.id);
        res.json(scripts);
    } catch (error) {
        console.error('Get Script Templates Error:', error);
        res.status(500).json({ error: 'Failed to fetch script templates' });
    }
};

export const getScriptTemplate = async (req: any, res: Response) => {
    try {
        const script = await scriptTemplatesService.getScriptById(req.params.id, req.user.id);
        if (!script) {
            return res.status(404).json({ error: 'Script template not found' });
        }
        res.json(script);
    } catch (error) {
        console.error('Get Script Template Error:', error);
        res.status(500).json({ error: 'Failed to fetch script template' });
    }
};

export const createScriptTemplate = async (req: any, res: Response) => {
    try {
        const { title, content, category } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content structure are required' });
        }

        const script = await scriptTemplatesService.createScriptTemplate(req.user.id, { title, content, category });
        res.status(201).json(script);
    } catch (error: any) {
        console.error('Create Script Template Error:', error);
        res.status(500).json({ error: 'Failed to create script template', details: error.message });
    }
};

export const updateScriptTemplate = async (req: any, res: Response) => {
    try {
        const id = req.params.id as string;
        const script = await scriptTemplatesService.updateScriptTemplate(id, req.user.id, req.body);
        
        if (!script) {
            return res.status(404).json({ error: 'Script template not found' });
        }

        res.json(script);
    } catch (error) {
        console.error('Update Script Template Error:', error);
        res.status(500).json({ error: 'Failed to update script template' });
    }
};

export const deleteScriptTemplate = async (req: any, res: Response) => {
    try {
        const success = await scriptTemplatesService.deleteScript(req.params.id, req.user.id);
        if (!success) {
            return res.status(404).json({ error: 'Script template not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Delete Script Template Error:', error);
        res.status(500).json({ error: 'Failed to delete script template' });
    }
};
