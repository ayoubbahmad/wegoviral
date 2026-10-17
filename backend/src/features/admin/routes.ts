import { Router } from 'express';
import * as adminController from './controller';
import { protect, requirePermission } from '../../middleware/auth.middleware';

// Every route also checks finer rules in the service (rank, self, last Super Admin…)
const router = Router();

router.use(protect, requirePermission('admin.access'));

router.get('/overview', requirePermission('stats.view'), adminController.getOverview);

router.get('/members', requirePermission('members.view'), adminController.listMembers);
router.get('/members/:id', requirePermission('members.view'), adminController.getMember);
router.patch('/members/:id/role', requirePermission('roles.manage'), adminController.changeRole);
router.post('/members/:id/restriction', requirePermission('members.restrict'), adminController.restrictMember);
router.delete('/members/:id/restriction', requirePermission('members.restrict'), adminController.liftRestriction);

router.get('/activity', requirePermission('activity.view'), adminController.listActivity);

export default router;
