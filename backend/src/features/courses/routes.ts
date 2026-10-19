import { Router } from 'express';
import * as coursesController from './controller';
import { protect, requireCanInteract } from '../../middleware/auth.middleware';

// Who may edit is checked in the service (admins, or the owner if they're an instructor+)
const router = Router();

router.use(protect);

router.get('/', coursesController.listCourses);
router.post('/', coursesController.createCourse);
router.get('/:id', coursesController.getCourse);
router.patch('/:id', coursesController.updateCourse);
router.delete('/:id', coursesController.deleteCourse);

// Taking a course
router.get('/:id/lessons/:lessonId', coursesController.getLesson);
router.put('/:id/lessons/:lessonId/complete', requireCanInteract, coursesController.completeLesson);
router.delete('/:id/lessons/:lessonId/complete', requireCanInteract, coursesController.uncompleteLesson);

// Building a course
router.get('/:id/edit', coursesController.getCourseForEditing);
router.put('/:id/outline', coursesController.saveOutline);
router.post('/:id/modules', coursesController.createModule);
router.patch('/modules/:moduleId', coursesController.updateModule);
router.delete('/modules/:moduleId', coursesController.deleteModule);
router.post('/modules/:moduleId/lessons', coursesController.createLesson);
router.patch('/lessons/:lessonId', coursesController.updateLesson);
router.delete('/lessons/:lessonId', coursesController.deleteLesson);
router.post('/:id/uploads', coursesController.createUpload);

router.get('/:id/stats', coursesController.getStats);
router.get('/:id/access', coursesController.getAccess);
router.put('/:id/access', coursesController.setAccess);

export default router;
