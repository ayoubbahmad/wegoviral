import { Router } from 'express';
import * as challengesController from './controller';
import { protect, requireCanInteract } from '../../middleware/auth.middleware';

// Managing is checked in the service (challenges.manage)
const router = Router();

router.use(protect);

router.get('/', challengesController.listChallenges);
router.post('/', challengesController.createChallenge);
router.get('/:id', challengesController.getChallenge);
router.patch('/:id', challengesController.updateChallenge);
router.delete('/:id', challengesController.deleteChallenge);

router.put('/:id/join', requireCanInteract, challengesController.join);
router.delete('/:id/join', challengesController.leave);
router.get('/:id/check-ins', challengesController.listCheckIns);
router.post('/:id/check-ins', requireCanInteract, challengesController.checkIn);
router.delete('/:id/check-ins/:checkInId', challengesController.deleteCheckIn);

router.get('/:id/leaderboard', challengesController.getLeaderboard);
router.put('/:id/winners', challengesController.setWinners);
router.get('/:id/access', challengesController.getAccess);
router.put('/:id/access', challengesController.setAccess);

export default router;
