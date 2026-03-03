import { Router } from 'express';
import * as projectsController from './controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', projectsController.getProjects);
router.get('/:id', projectsController.getProject);
router.post('/', projectsController.createProject);
router.patch('/:id', projectsController.updateProject);
router.delete('/:id', projectsController.deleteProject);

router.post('/:projectId/items', projectsController.createProjectItem);

export default router;
