import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service.ts';
import { successResponse, errorResponse } from '../utils/response.ts';

export class ChatController {
  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, history, studentProfile, sessionId } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json(errorResponse('VALIDATION_ERROR', 'Message string is required'));
      }

      if (message.length > 2000) {
        return res.status(400).json(errorResponse('MESSAGE_TOO_LONG', 'Message cannot exceed 2000 characters'));
      }

      const reply = await aiService.generateCareerAdvice({
        message,
        history,
        studentProfile,
        sessionId,
      });

      res.json(successResponse({ reply }));
    } catch (err) {
      next(err);
    }
  }

  async tts(req: Request, res: Response, next: NextFunction) {
    try {
      const { text, voiceName } = req.body;
      if (!text) {
        return res.status(400).json(errorResponse('VALIDATION_ERROR', 'Text is required for TTS'));
      }

      const result = await aiService.synthesizeSpeech(text, voiceName);
      res.json(successResponse(result));
    } catch (err) {
      next(err);
    }
  }
}

export const chatController = new ChatController();
