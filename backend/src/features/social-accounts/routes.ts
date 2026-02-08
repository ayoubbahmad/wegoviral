import { Router } from 'express';
import { socialAccountController } from './controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/auth-url', (req, res) => socialAccountController.getAuthUrl(req, res));
router.get('/callback', (req, res) => socialAccountController.handleCallback(req, res));
router.get('/me', (req, res) => socialAccountController.getMyAccounts(req, res));

export default router;
