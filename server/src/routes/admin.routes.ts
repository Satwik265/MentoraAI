import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.ts';
import { requireAuth } from '../middleware/auth.middleware.ts';
import { requireRole } from '../middleware/role.middleware.ts';

const router = Router();

router.get('/dashboard', adminController.getDashboardStats);
router.get('/logs', requireAuth, requireRole('admin'), adminController.getAuditLogs);
router.get('/feedback/pending', requireAuth, requireRole('admin'), adminController.getPendingFeedback);
router.patch('/feedback/:id/moderate', requireAuth, requireRole('admin'), adminController.moderateFeedback);

export default router;
