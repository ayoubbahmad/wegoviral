import { Router } from 'express';
import * as communityController from '../controllers/community.controller';

const router = Router();

router.get('/followers', communityController.getFollowers);
router.get('/summary', communityController.getCommunitySummary);

export default router;
