import { Router } from 'express';
import * as authController from './controller';
import { protect } from '../../middleware/auth.middleware';

// Sign up, login and Google OAuth are handled by Supabase Auth on the frontend
const router = Router();

router.get('/me', protect, authController.getMe);
router.get('/username-available', authController.checkUsername);

export default router;
