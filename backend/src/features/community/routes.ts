import { Router } from 'express';
import * as communityController from './controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

// Apply protection to all community routes
router.use(protect);

router.get('/followers', communityController.getFollowers);
router.get('/summary', communityController.getCommunitySummary);

export default router;
