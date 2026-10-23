import { Response } from 'express';
import { ZodError } from 'zod';
import { DirectoryQuerySchema, getProfile, listMembers, MembersError } from './service';

const handle =
  (action: string, fn: (req: any, res: Response) => Promise<unknown>) =>
  async (req: any, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ error: error.issues[0]?.message || 'Invalid request' });
      if (error instanceof MembersError) return res.status(error.status).json({ error: error.message });
      console.error(`Failed to ${action}:`, error);
      res.status(500).json({ error: `Failed to ${action}` });
    }
  };

export const list = handle('load members', async (req, res) => {
  res.json(await listMembers(DirectoryQuerySchema.parse(req.query)));
});

export const profile = handle('load the profile', async (req, res) => {
  res.json(await getProfile(req.user.id, String(req.params.username)));
});
