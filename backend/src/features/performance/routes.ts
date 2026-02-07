import { Router } from 'express';
import * as performanceController from './controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

// Apply protection to all performance routes
router.use(protect);

router.get('/posts', performanceController.getUserPosts);
router.get('/insights', performanceController.getPerformanceInsights);

export default router;
