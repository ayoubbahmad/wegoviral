import { Router } from 'express';
import * as eventsController from './controller';
import { protect, requireCanInteract } from '../../middleware/auth.middleware';

// Who may edit is checked in the service (staff, or the host if they're an instructor+)
const router = Router();

router.use(protect);

router.get('/', eventsController.listEvents);
router.get('/categories', eventsController.listCategories);
router.get('/:id', eventsController.getEvent);
router.post('/', eventsController.createEvent);
router.patch('/:id', eventsController.updateEvent);
router.delete('/:id', eventsController.deleteEvent);

router.put('/:id/rsvp', requireCanInteract, eventsController.going);
router.delete('/:id/rsvp', eventsController.notGoing);

router.get('/:id/attendees', eventsController.listAttendees);
router.get('/:id/access', eventsController.getAccess);
router.put('/:id/access', eventsController.setAccess);

export default router;
