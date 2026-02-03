import { Router } from 'express';
import * as scriptsController from '../controllers/scripts.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Apply protection to all script routes
router.use(protect);

router.get('/', scriptsController.getScripts);
router.post('/', scriptsController.createScript);
router.delete('/:id', scriptsController.deleteScript);

export default router;
