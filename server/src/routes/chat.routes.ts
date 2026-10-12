import { Router } from 'express';
import { chatController } from '../controllers/chat.controller.ts';
import { aiRateLimiter } from '../middleware/rateLimit.middleware.ts';

const router = Router();

router.post('/', aiRateLimiter, chatController.chat);
router.post('/tts', aiRateLimiter, chatController.tts);

export default router;
