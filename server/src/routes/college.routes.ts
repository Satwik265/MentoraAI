import { Router } from 'express';
import { collegeController } from '../controllers/college.controller.ts';

const router = Router();

router.get('/', collegeController.getColleges);
router.get('/:id', collegeController.getCollegeById);
router.get('/:id/courses', collegeController.getCourses);
router.get('/:id/cutoffs', collegeController.getCutoffs);

export default router;
