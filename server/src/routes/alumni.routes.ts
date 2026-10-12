import { Router } from 'express';
import { alumniController } from '../controllers/alumni.controller.ts';

const router = Router();

router.get('/', alumniController.getAlumni);
router.get('/:id', alumniController.getAlumniById);
router.post('/:id/questions', alumniController.askQuestion);

export default router;
