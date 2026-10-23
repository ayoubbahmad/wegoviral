import { Router } from 'express';
import * as membersController from './controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect);
router.get('/', membersController.list);
router.get('/:username', membersController.profile);

export default router;
