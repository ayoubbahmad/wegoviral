import { Router } from 'express';
import * as competitorsController from './controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

// Apply protection to all competitor routes
router.use(protect);

router.get('/', competitorsController.getCompetitors);
router.get('/preview', competitorsController.previewCompetitor);
router.get('/:id', competitorsController.getCompetitor);
router.post('/', competitorsController.createCompetitor);
router.post('/bulk', competitorsController.bulkCreateCompetitors);
router.post('/sync', competitorsController.syncAllCompetitors);
router.patch('/:id', competitorsController.updateCompetitor);
router.delete('/:id', competitorsController.deleteCompetitor);
router.post('/:id/sync', competitorsController.syncVideos);

export default router;
