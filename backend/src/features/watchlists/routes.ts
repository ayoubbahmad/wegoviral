import { Router } from 'express';
import * as watchlistController from './controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', watchlistController.getWatchlists);
router.post('/', watchlistController.createWatchlist);
router.get('/:id', watchlistController.getWatchlist);
router.patch('/:id', watchlistController.updateWatchlist);
router.delete('/:id', watchlistController.deleteWatchlist);

router.post('/add-competitor', watchlistController.addCompetitorToWatchlist);
router.post(
  '/remove-competitor',
  watchlistController.removeCompetitorFromWatchlist,
);

export default router;
