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

router.patch('/members/:id/special', requirePermission('members.exempt'), adminController.setSpecialMember);

router.get('/activity', requirePermission('activity.view'), adminController.listActivity);

// Joining
router.get('/applications', requirePermission('members.approve'), adminController.listApplications);
router.post('/applications/:userId/approve', requirePermission('members.approve'), adminController.approveApplication);
router.post('/applications/:userId/reject', requirePermission('members.approve'), adminController.rejectApplication);

router.get('/settings', requirePermission('community.settings'), adminController.getSettings);
router.patch('/settings', requirePermission('community.settings'), adminController.updateSettings);

router.get('/guide', requirePermission('community.settings'), adminController.getGuide);
router.put('/guide/sections', requirePermission('community.settings'), adminController.saveGuideSections);
router.put('/guide/quiz', requirePermission('community.settings'), adminController.saveQuiz);
router.post('/guide/publish', requirePermission('community.settings'), adminController.publishGuide);

router.get('/invites', requirePermission('invites.manage'), adminController.listInvites);
router.post('/invites', requirePermission('invites.manage'), adminController.createInvite);
router.delete('/invites/:id', requirePermission('invites.manage'), adminController.revokeInvite);

export default router;
