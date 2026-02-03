import { Router } from 'express';
import * as scriptsController from '../controllers/scripts.controller';

const router = Router();

router.get('/', scriptsController.getScripts);
router.post('/', scriptsController.createScript);
router.delete('/:id', scriptsController.deleteScript);

export default router;
