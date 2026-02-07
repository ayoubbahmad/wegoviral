import { Router } from 'express';
import * as competitorsController from './controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

// Apply protection to all competitor routes
router.use(protect);

router.get('/', competitorsController.getCompetitors);
router.get('/:id', competitorsController.getCompetitor);
router.post('/', competitorsController.createCompetitor);
router.patch('/:id', competitorsController.updateCompetitor);
router.delete('/:id', competitorsController.deleteCompetitor);

export default router;
