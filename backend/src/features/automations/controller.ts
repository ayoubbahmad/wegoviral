import { Response } from 'express';
import { automationService } from './service';

export const getAllAutomations = async (req: any, res: Response) => {
  try {
    const automations = await automationService.getAllAutomations(req.user.id);
    res.json(automations);
  } catch (error) {
    console.error('Get All Automations Error:', error);
    res.status(500).json({ error: 'Failed to fetch automations' });
  }
};

export const getAutomationById = async (req: any, res: Response) => {
  try {
    const automation = await automationService.getAutomationById(req.params.id, req.user.id);
    if (!automation) return res.status(404).json({ error: 'Automation not found' });
    res.json(automation);
  } catch (error) {
    console.error('Get Automation Error:', error);
    res.status(500).json({ error: 'Failed to fetch automation' });
  }
};

export const createAutomation = async (req: any, res: Response) => {
  try {
    const automation = await automationService.createAutomation(req.user.id, req.body);
    res.status(201).json(automation);
  } catch (error) {
    console.error('Create Automation Error:', error);
    res.status(500).json({ error: 'Failed to create automation' });
  }
};

export const updateAutomation = async (req: any, res: Response) => {
  try {
    const automation = await automationService.updateAutomation(req.params.id, req.user.id, req.body);
    if (!automation) return res.status(404).json({ error: 'Automation not found' });
    res.json(automation);
  } catch (error) {
    console.error('Update Automation Error:', error);
    res.status(500).json({ error: 'Failed to update automation' });
  }
};

export const deleteAutomation = async (req: any, res: Response) => {
  try {
    const success = await automationService.deleteAutomation(req.params.id, req.user.id);
    if (!success) return res.status(404).json({ error: 'Automation not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Delete Automation Error:', error);
    res.status(500).json({ error: 'Failed to delete automation' });
  }
};
