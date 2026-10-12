import { Router } from 'express';
import { feedbackController } from '../controllers/feedback.controller.ts';
import { optionalAuth } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/', feedbackController.getReviews);
router.post('/', optionalAuth, feedbackController.addReview);

export default router;
