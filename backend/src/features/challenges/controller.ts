import { Response } from 'express';
import { ZodError } from 'zod';
import * as challengesService from './service';
import { setAccessRule } from '../admin/access.service';
import { can } from '../../lib/permissions';
import { AccessRuleSchema, AdminError } from '../admin/model';
import { ChallengeError, CheckInSchema, CreateChallengeSchema, ListChallengesQuerySchema, UpdateChallengeSchema, WinnersSchema } from './model';

const handle =
  (action: string, fn: (req: any, res: Response) => Promise<unknown>) =>
  async (req: any, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues[0]?.message || 'Invalid request' });
      }
      if (error instanceof ChallengeError || error instanceof AdminError) {
        return res.status(error.status).json({ error: error.message });
      }
      req.log?.error({ err: error }, `${action} failed`);
      res.status(500).json({ error: `Failed to ${action}` });
    }
  };

export const listChallenges = handle('load challenges', async (req, res) => {
  res.json(await challengesService.listChallenges(req.user, ListChallengesQuerySchema.parse(req.query).scope));
});

export const getChallenge = handle('load challenge', async (req, res) => {
  res.json(await challengesService.getChallenge(req.user, req.params.id));
});

export const createChallenge = handle('create challenge', async (req, res) => {
  // Before validating, so members get "not allowed" rather than form errors
  if (!can(req.user.role, 'challenges.manage')) throw new ChallengeError(403, 'Only the team can manage challenges');
  res.status(201).json(await challengesService.createChallenge(req.user, CreateChallengeSchema.parse(req.body)));
});

export const updateChallenge = handle('update challenge', async (req, res) => {
  res.json(await challengesService.updateChallenge(req.user, req.params.id, UpdateChallengeSchema.parse(req.body)));
});

export const deleteChallenge = handle('delete challenge', async (req, res) => {
  await challengesService.deleteChallenge(req.user, req.params.id);
  res.status(204).end();
});

export const join = handle('join challenge', async (req, res) => {
  res.json(await challengesService.join(req.user, req.params.id));
});

export const leave = handle('leave challenge', async (req, res) => {
  res.json(await challengesService.leave(req.user, req.params.id));
});

export const checkIn = handle('check in', async (req, res) => {
  res.status(201).json(await challengesService.checkIn(req.user, req.params.id, CheckInSchema.parse(req.body)));
});

export const listCheckIns = handle('load check-ins', async (req, res) => {
  const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
  res.json(await challengesService.listCheckIns(req.user, req.params.id, cursor));
});

export const deleteCheckIn = handle('remove check-in', async (req, res) => {
  await challengesService.deleteCheckIn(req.user, req.params.id, req.params.checkInId);
  res.status(204).end();
});

export const getLeaderboard = handle('load leaderboard', async (req, res) => {
  res.json(await challengesService.getLeaderboard(req.user, req.params.id));
});

export const setWinners = handle('save winners', async (req, res) => {
  res.json(await challengesService.setWinners(req.user, req.params.id, WinnersSchema.parse(req.body)));
});

export const getAccess = handle('load access rule', async (req, res) => {
  res.json(await challengesService.getChallengeAccess(req.user, req.params.id));
});

export const setAccess = handle('save access rule', async (req, res) => {
  await challengesService.assertCanManage(req.user, req.params.id);
  res.json(await setAccessRule(req.user, 'challenge', req.params.id, AccessRuleSchema.parse(req.body)));
});
