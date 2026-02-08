import { Router } from 'express';
import * as automationController from './controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', automationController.getAllAutomations);
router.get('/:id', automationController.getAutomationById);
router.post('/', automationController.createAutomation);
router.patch('/:id', automationController.updateAutomation);
router.delete('/:id', automationController.deleteAutomation);

export default router;
