import { Router } from 'express';
import { scholarshipController } from '../controllers/scholarship.controller.ts';
import { optionalAuth } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/', scholarshipController.getScholarships);
router.get('/:id', scholarshipController.getScholarshipById);
router.post('/match', optionalAuth, scholarshipController.matchScholarships);

export default router;
