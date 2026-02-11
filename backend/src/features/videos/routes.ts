import { Router } from 'express';
import * as videosController from './controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

// Apply protection to all video routes
router.use(protect);

router.get('/', videosController.getVideos);
router.get('/:id', videosController.getVideo);

export default router;
