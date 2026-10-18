import { Router } from 'express';
import * as authController from './controller';
import { protectAllowRestricted } from '../../middleware/auth.middleware';

// Sign up, login and Google OAuth are handled by Supabase Auth on the frontend
const router = Router();

// Restricted members can still load their profile, so the app can explain why
router.get('/me', protectAllowRestricted, authController.getMe);
router.get('/username-available', authController.checkUsername);
router.post('/warnings/:id/ack', protectAllowRestricted, authController.acknowledgeWarning);

export default router;
