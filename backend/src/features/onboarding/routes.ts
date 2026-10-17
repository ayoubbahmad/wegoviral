import { Router } from 'express';
import * as onboardingController from './controller';
import { protect, protectJoining } from '../../middleware/auth.middleware';

const router = Router();

// Public: preview for /join/:code before signing up
router.get('/codes/:code', onboardingController.describeCode);

// Signed in but not necessarily approved yet
router.post('/application', protectJoining, onboardingController.submitApplication);
router.get('/guide', protectJoining, onboardingController.getGuide);
router.post('/guide/accept', protectJoining, onboardingController.acceptRules);

// Approved members
router.post('/quiz', protect, onboardingController.submitQuiz);
router.get('/referral', protect, onboardingController.getReferral);

export default router;
