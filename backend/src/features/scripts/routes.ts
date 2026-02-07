import { Router } from 'express';
import * as scriptsController from './controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

// Apply protection to all script routes
router.use(protect);

router.get('/', scriptsController.getScripts);
router.get('/:id', scriptsController.getScript);
router.post('/', scriptsController.createScript);
router.patch('/:id', scriptsController.updateScript);
router.delete('/:id', scriptsController.deleteScript);

export default router;
