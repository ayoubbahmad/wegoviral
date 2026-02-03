import { Router } from 'express';
import * as performanceController from '../controllers/performance.controller';

const router = Router();

router.get('/posts', performanceController.getUserPosts);
router.get('/insights', performanceController.getPerformanceInsights);

export default router;
