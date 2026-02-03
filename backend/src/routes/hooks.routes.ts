import { Router } from 'express';
import * as hooksController from '../controllers/hooks.controller';

const router = Router();

router.get('/', hooksController.getHooks);
router.post('/', hooksController.createHook);
router.delete('/:id', hooksController.deleteHook);

export default router;
