import { Response } from 'express';
import { ZodError } from 'zod';
import * as adminService from './service';
import {
  AdminError,
  ChangeRoleSchema,
  ListActivityQuerySchema,
  ListMembersQuerySchema,
  RestrictMemberSchema,
} from './model';

/** Maps validation and permission errors to proper status codes. */
const handle =
  (action: string, fn: (req: any, res: Response) => Promise<unknown>) =>
  async (req: any, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues[0]?.message || 'Invalid request' });
      }
      if (error instanceof AdminError) {
        return res.status(error.status).json({ error: error.message });
      }
      req.log?.error({ err: error }, `${action} failed`);
      res.status(500).json({ error: `Failed to ${action}` });
    }
  };

export const getOverview = handle('load overview', async (_req, res) => {
  res.json(await adminService.getOverview());
});

export const listMembers = handle('load members', async (req, res) => {
  res.json(await adminService.listMembers(ListMembersQuerySchema.parse(req.query)));
});

export const getMember = handle('load member', async (req, res) => {
  res.json(await adminService.getMember(req.user, req.params.id));
});

export const changeRole = handle('change role', async (req, res) => {
  const { role } = ChangeRoleSchema.parse(req.body);
  res.json(await adminService.changeRole(req.user, req.params.id, role));
});

export const restrictMember = handle('restrict member', async (req, res) => {
  const input = RestrictMemberSchema.parse(req.body);
  res.json(await adminService.restrictMember(req.user, req.params.id, input));
});

export const liftRestriction = handle('lift restriction', async (req, res) => {
  res.json(await adminService.liftRestriction(req.user, req.params.id));
});

export const listActivity = handle('load activity', async (req, res) => {
  res.json(await adminService.listActivity(ListActivityQuerySchema.parse(req.query)));
});
