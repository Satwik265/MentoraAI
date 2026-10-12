import { Router } from 'express';
import { admissionController } from '../controllers/admission.controller.ts';
import { optionalAuth } from '../middleware/auth.middleware.ts';

const router = Router();

router.get('/', optionalAuth, admissionController.getAdmissions);
router.post('/', optionalAuth, admissionController.createAdmission);
router.patch('/:id', optionalAuth, admissionController.updateAdmission);
router.delete('/:id', optionalAuth, admissionController.deleteAdmission);

export default router;
