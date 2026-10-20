import { Response } from 'express';
import { ZodError } from 'zod';
import * as onboardingService from './service';
import { AcceptRulesSchema, ApplicationSchema, OnboardingError, QuizAnswersSchema } from './model';
import { translateMessage } from '../../lib/i18n';

const handle =
  (action: string, fn: (req: any, res: Response) => Promise<unknown>) =>
  async (req: any, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues[0]?.message || 'Invalid request' });
      }
      if (error instanceof OnboardingError) {
        return res.status(error.status).json({ error: error.message });
      }
      req.log?.error({ err: error }, `${action} failed`);
      res.status(500).json({ error: `Failed to ${action}` });
    }
  };

export const describeCode = handle('check link', async (req, res) => {
  const preview = await onboardingService.describeCode(String(req.params.code));
  res.json(preview.valid ? preview : { ...preview, reason: translateMessage(preview.reason ?? '', req.locale) });
});

export const submitApplication = handle('submit application', async (req, res) => {
  const input = ApplicationSchema.parse(req.body);
  res.status(201).json(await onboardingService.submitApplication(req.user.id, input));
});

export const getGuide = handle('load guide', async (req, res) => {
  res.json(await onboardingService.getGuide(req.user.id));
});

export const acceptRules = handle('accept rules', async (req, res) => {
  const { version } = AcceptRulesSchema.parse(req.body);
  res.json(await onboardingService.acceptRules(req.user.id, version));
});

export const submitQuiz = handle('submit quiz', async (req, res) => {
  const { answers } = QuizAnswersSchema.parse(req.body);
  res.json(await onboardingService.submitQuiz(req.user.id, answers));
});

export const getReferral = handle('load referral link', async (req, res) => {
  res.json(await onboardingService.getReferral(req.user.id));
});
