import { Router } from 'express';
import * as homeController from './controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.get('/summary', protect, homeController.getHomeSummary);

export default router;
