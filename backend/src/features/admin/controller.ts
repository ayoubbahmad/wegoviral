import { Response } from 'express';
import { ZodError } from 'zod';
import * as adminService from './service';
import * as joiningService from './joining.service';
import * as moderationService from './moderation.service';
import * as spacesService from './spaces.service';
import * as accessService from './access.service';
import * as gamificationService from './gamification.service';
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
  ListReportsQuerySchema,
  ResolveReportsSchema,
  WarnMemberSchema,
  RestoreSchema,
  CreateSpaceSchema,
  UpdateSpaceSchema,
  ReorderSpacesSchema,
  ArchiveSpaceSchema,
  TierSchema,
  UpdateTierSchema,
  MemberTierSchema,
  AccessRuleSchema,
  PointRulesSchema,
  LevelsSchema,
  BadgeSchema,
  UpdateBadgeSchema,
  ArchiveBadgeSchema,
  AwardBadgeSchema,
  AdjustPointsSchema,
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

// ─── Moderation ──────────────────────────────────────────────────────────────

export const listReports = handle('load reports', async (req, res) => {
  const { status } = ListReportsQuerySchema.parse(req.query);
  res.json(await moderationService.listReports(status));
});

export const resolveReports = handle('handle reports', async (req, res) => {
  res.json(await moderationService.resolveReports(req.user, ResolveReportsSchema.parse(req.body)));
});

export const warnMember = handle('warn member', async (req, res) => {
  const { reason } = WarnMemberSchema.parse(req.body);
  res.status(201).json(await moderationService.issueWarning(req.user, req.params.id, reason));
});

export const listHeld = handle('load held content', async (_req, res) => {
  res.json(await moderationService.listHeldContent());
});

export const releaseComment = handle('release comment', async (req, res) => {
  await moderationService.releaseComment(req.user, req.params.id);
  res.status(204).end();
});

export const listDeleted = handle('load deleted content', async (_req, res) => {
  res.json(await moderationService.listDeleted());
});

export const restoreContent = handle('restore', async (req, res) => {
  const { targetType, id } = RestoreSchema.parse(req.body);
  res.json(await moderationService.restoreContent(req.user, targetType, id));
});

// ─── Spaces ──────────────────────────────────────────────────────────────────

export const listSpaces = handle('load spaces', async (_req, res) => {
  res.json(await spacesService.listAllSpaces());
});

export const createSpace = handle('create space', async (req, res) => {
  res.status(201).json(await spacesService.createSpace(req.user, CreateSpaceSchema.parse(req.body)));
});

export const updateSpace = handle('update space', async (req, res) => {
  res.json(await spacesService.updateSpace(req.user, req.params.id, UpdateSpaceSchema.parse(req.body)));
});

export const reorderSpaces = handle('reorder spaces', async (req, res) => {
  const { ids } = ReorderSpacesSchema.parse(req.body);
  res.json(await spacesService.reorderSpaces(req.user, ids));
});

export const archiveSpace = handle('archive space', async (req, res) => {
  const { archived } = ArchiveSpaceSchema.parse(req.body);
  res.json(await spacesService.setArchived(req.user, req.params.id, archived));
});

// ─── Tiers & access ──────────────────────────────────────────────────────────

export const listTiers = handle('load tiers', async (_req, res) => {
  res.json(await accessService.listTiers());
});

export const createTier = handle('create tier', async (req, res) => {
  res.status(201).json(await accessService.createTier(req.user, TierSchema.parse(req.body)));
});

export const updateTier = handle('update tier', async (req, res) => {
  res.json(await accessService.updateTier(req.user, req.params.id, UpdateTierSchema.parse(req.body)));
});

export const deleteTier = handle('delete tier', async (req, res) => {
  await accessService.deleteTier(req.user, req.params.id);
  res.status(204).end();
});

export const setMemberTier = handle('change tier', async (req, res) => {
  const { tierId } = MemberTierSchema.parse(req.body);
  res.json(await accessService.setMemberTier(req.user, req.params.id, tierId));
});

export const getSpaceAccess = handle('load access rule', async (req, res) => {
  res.json(await accessService.getAccessRule('space', req.params.id));
});

export const setSpaceAccess = handle('save access rule', async (req, res) => {
  res.json(await accessService.setAccessRule(req.user, 'space', req.params.id, AccessRuleSchema.parse(req.body)));
});

// ─── Points, levels & badges ─────────────────────────────────────────────────

export const getGamification = handle('load points and badges', async (_req, res) => {
  res.json(await gamificationService.getGamification());
});

export const updatePointRules = handle('save point rules', async (req, res) => {
  res.json(await gamificationService.updatePointRules(req.user, PointRulesSchema.parse(req.body)));
});

export const updateLevels = handle('save levels', async (req, res) => {
  res.json(await gamificationService.updateLevels(req.user, LevelsSchema.parse(req.body)));
});

export const createBadge = handle('create badge', async (req, res) => {
  res.status(201).json(await gamificationService.createBadge(req.user, BadgeSchema.parse(req.body)));
});

export const updateBadge = handle('update badge', async (req, res) => {
  res.json(await gamificationService.updateBadge(req.user, req.params.id, UpdateBadgeSchema.parse(req.body)));
});

export const archiveBadge = handle('archive badge', async (req, res) => {
  const { archived } = ArchiveBadgeSchema.parse(req.body);
  res.json(await gamificationService.setBadgeArchived(req.user, req.params.id, archived));
});

export const awardBadge = handle('award badge', async (req, res) => {
  const { badgeId, note } = AwardBadgeSchema.parse(req.body);
  await gamificationService.awardBadge(req.user, req.params.id, badgeId, note);
  res.status(201).json({ awarded: true });
});

export const removeBadge = handle('remove badge', async (req, res) => {
  await gamificationService.removeBadge(req.user, req.params.id, req.params.badgeId);
  res.status(204).end();
});

export const adjustPoints = handle('adjust points', async (req, res) => {
  const { points, reason } = AdjustPointsSchema.parse(req.body);
  res.json(await gamificationService.adjustMemberPoints(req.user, req.params.id, points, reason));
});
