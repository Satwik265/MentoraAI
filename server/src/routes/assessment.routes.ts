import { Router } from 'express';
import { assessmentController } from '../controllers/assessment.controller.ts';
import { optionalAuth } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/questions', assessmentController.getQuestions);
router.post('/evaluate', optionalAuth, assessmentController.evaluate);
router.get('/latest', optionalAuth, assessmentController.getLatest);
router.get('/history', optionalAuth, assessmentController.getHistory);

export default router;
