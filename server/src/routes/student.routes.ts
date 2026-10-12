import { Router } from 'express';
import { studentController } from '../controllers/student.controller.ts';
import { requireAuth } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/me', requireAuth, studentController.getProfile);
router.put('/me', requireAuth, studentController.updateProfile);
router.get('/me/dashboard', requireAuth, studentController.getDashboard);
router.get('/me/academics', requireAuth, studentController.getAcademics);
router.post('/me/academics', requireAuth, studentController.addAcademicRecord);

export default router;
