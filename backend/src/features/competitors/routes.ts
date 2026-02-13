import { Router } from 'express';
import * as competitorsController from './controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

// Apply protection to all competitor routes
router.use(protect);

router.get('/', competitorsController.getCompetitors);
router.get('/preview', competitorsController.previewCompetitor);

// Creator routes
router.get('/creators', competitorsController.getCreators);
router.post('/creators', competitorsController.createCreator);
router.get('/creators/:id', competitorsController.getCreator);
router.post('/creators/link', competitorsController.linkCompetitor);
router.post('/creators/unlink/:id', competitorsController.unlinkCompetitor);

router.get('/:id', competitorsController.getCompetitor);
router.post('/', competitorsController.createCompetitor);
router.post('/bulk', competitorsController.bulkCreateCompetitors);
router.post('/sync', competitorsController.syncAllCompetitors);
router.patch('/:id', competitorsController.updateCompetitor);
router.delete('/:id', competitorsController.deleteCompetitor);
router.post('/:id/sync', competitorsController.syncVideos);

export default router;
