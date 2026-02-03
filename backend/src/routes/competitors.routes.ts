import { Router } from 'express';
import * as competitorsController from '../controllers/competitors.controller';

const router = Router();

router.get('/', competitorsController.getCompetitors);
router.post('/', competitorsController.createCompetitor);
router.delete('/:id', competitorsController.deleteCompetitor);

export default router;
