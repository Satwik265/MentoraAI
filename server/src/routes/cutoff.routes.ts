import { Router } from 'express';
import { cutoffController } from '../controllers/cutoff.controller.ts';

const router = Router();

router.get('/', cutoffController.getCutoffs);
router.post('/predict', cutoffController.predict);

export default router;
