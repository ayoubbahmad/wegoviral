import { Response } from 'express';
import { ZodError } from 'zod';
import * as adminService from './service';
import * as joiningService from './joining.service';
import {
  AdminError,
  ChangeRoleSchema,
  ListActivityQuerySchema,
  ListMembersQuerySchema,
  RestrictMemberSchema,
  ListApplicationsQuerySchema,
  RejectApplicationSchema,
  SpecialMemberSchema,
  UpdateSettingsSchema,
  GuideSectionsSchema,
  QuizSchema,
  CreateInviteSchema,
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

// ─── Joining ─────────────────────────────────────────────────────────────────

export const listApplications = handle('load applications', async (req, res) => {
  res.json(await joiningService.listApplications(ListApplicationsQuerySchema.parse(req.query)));
});

export const approveApplication = handle('approve application', async (req, res) => {
  res.json(await joiningService.reviewApplication(req.user, req.params.userId, 'APPROVED'));
});

export const rejectApplication = handle('reject application', async (req, res) => {
  const { note } = RejectApplicationSchema.parse(req.body ?? {});
  res.json(await joiningService.reviewApplication(req.user, req.params.userId, 'REJECTED', note));
});

export const setSpecialMember = handle('update special member', async (req, res) => {
  const { specialMember } = SpecialMemberSchema.parse(req.body);
  res.json(await joiningService.setSpecialMember(req.user, req.params.id, specialMember));
});

export const getSettings = handle('load settings', async (_req, res) => {
  res.json(await joiningService.getCommunitySettings());
});

export const updateSettings = handle('update settings', async (req, res) => {
  res.json(await joiningService.updateCommunitySettings(req.user, UpdateSettingsSchema.parse(req.body)));
});

export const getGuide = handle('load guide', async (_req, res) => {
  res.json(await joiningService.getGuideForAdmin());
});

export const saveGuideSections = handle('save guide', async (req, res) => {
  res.json(await joiningService.saveGuideSections(req.user, GuideSectionsSchema.parse(req.body)));
});

export const saveQuiz = handle('save quiz', async (req, res) => {
  res.json(await joiningService.saveQuiz(req.user, QuizSchema.parse(req.body)));
});

export const publishGuide = handle('publish guide', async (req, res) => {
  res.json(await joiningService.publishGuide(req.user));
});

export const listInvites = handle('load invite links', async (_req, res) => {
  res.json(await joiningService.listInvites());
});

export const createInvite = handle('create invite link', async (req, res) => {
  res.status(201).json(await joiningService.createInvite(req.user, CreateInviteSchema.parse(req.body)));
});

export const revokeInvite = handle('turn off invite link', async (req, res) => {
  res.json(await joiningService.revokeInvite(req.user, req.params.id));
});
