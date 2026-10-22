import { Router } from 'express';
import * as profileController from './controller';
import { protectAllowRestricted } from '../../middleware/auth.middleware';

const router = Router();

// Restricted members can still manage their own account
router.use(protectAllowRestricted);
router.get('/settings', profileController.getSettings);
router.patch('/', profileController.updateProfile);
router.post('/avatar-upload', profileController.createAvatarUpload);
router.put('/preferences', profileController.updatePreferences);
router.put('/privacy', profileController.updatePrivacy);
router.post('/deletion-request', profileController.requestDeletion);
router.delete('/deletion-request', profileController.cancelDeletion);

export default router;
