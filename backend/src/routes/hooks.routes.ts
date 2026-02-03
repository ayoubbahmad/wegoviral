import { Router } from 'express';
import * as hooksController from '../controllers/hooks.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Apply protection to all hook routes
router.use(protect);

router.get('/', hooksController.getHooks);
router.post('/', hooksController.createHook);
router.patch('/:id', hooksController.updateHook);
router.delete('/:id', hooksController.deleteHook);

export default router;
