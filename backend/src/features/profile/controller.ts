import { Response } from 'express';
import { ZodError } from 'zod';
import * as profileService from './service';
import { AvatarUploadSchema, PreferencesSchema, PrivacySchema, ProfileError, UpdateProfileSchema } from './model';

/** Wraps a handler so validation errors map to proper status codes. */
const handle =
  (action: string, fn: (req: any, res: Response) => Promise<unknown>) =>
  async (req: any, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ error: error.issues[0]?.message || 'Invalid request' });
      if (error instanceof ProfileError) return res.status(error.status).json({ error: error.message });
      console.error(`Failed to ${action}:`, error);
      res.status(500).json({ error: `Failed to ${action}` });
    }
  };

export const getSettings = handle('load your settings', async (req, res) => {
  res.json(await profileService.getSettingsData(req.user.id));
});

export const updateProfile = handle('save your profile', async (req, res) => {
  res.json(await profileService.updateProfile(req.user.id, UpdateProfileSchema.parse(req.body)));
});

export const createAvatarUpload = handle('prepare the upload', async (req, res) => {
  const { contentType } = AvatarUploadSchema.parse(req.body);
  res.status(201).json(await profileService.createAvatarUpload(req.user.id, contentType));
});

export const updatePreferences = handle('save your preferences', async (req, res) => {
  res.json(await profileService.updatePreferences(req.user.id, PreferencesSchema.parse(req.body)));
});

export const updatePrivacy = handle('save your privacy settings', async (req, res) => {
  res.json(await profileService.updatePrivacy(req.user.id, PrivacySchema.parse(req.body)));
});

export const requestDeletion = handle('send your request', async (req, res) => {
  res.json(await profileService.setDeletionRequest(req.user.id, true));
});

export const cancelDeletion = handle('cancel your request', async (req, res) => {
  res.json(await profileService.setDeletionRequest(req.user.id, false));
});
