import { Request, Response, NextFunction } from 'express';
import { feedbackService } from '../services/feedback.service.ts';
import { successResponse, errorResponse } from '../utils/response.ts';
import { AuthRequest } from '../middleware/auth.middleware.ts';

export class FeedbackController {
  async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { collegeId } = req.query;
      const reviews = await feedbackService.getReviews(collegeId ? String(collegeId) : undefined);
      res.json(successResponse(reviews));
    } catch (err) {
      next(err);
    }
  }

  async addReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { collegeId, studentName, courseAndYear, rating, category, comment, pros, cons } = req.body;
      if (!collegeId || !rating || !comment) {
        return res.status(400).json(errorResponse('VALIDATION_ERROR', 'collegeId, rating, and comment are required'));
      }

      const review = await feedbackService.addReview({
        studentId: req.studentProfile?._id?.toString(),
        collegeId,
        studentName: studentName || req.studentProfile?.fullName || 'Verified Student',
        courseAndYear,
        rating: Number(rating),
        category,
        comment,
        pros,
        cons,
      });

      res.status(201).json(successResponse(review, 'Review published successfully'));
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json(errorResponse('NOT_FOUND', err.message));
      }
      next(err);
    }
  }
}

export const feedbackController = new FeedbackController();
