import { Router } from 'express';
import * as scriptTemplatesController from './controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

// Apply protection to all script template routes
router.use(protect);

router.get('/', scriptTemplatesController.getScriptTemplates);
router.get('/:id', scriptTemplatesController.getScriptTemplate);
router.post('/', scriptTemplatesController.createScriptTemplate);
router.patch('/:id', scriptTemplatesController.updateScriptTemplate);
router.delete('/:id', scriptTemplatesController.deleteScriptTemplate);

export default router;
