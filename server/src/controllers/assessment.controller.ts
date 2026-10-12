import { Request, Response, NextFunction } from 'express';
import { assessmentService } from '../services/assessment.service.ts';
import { AuthRequest } from '../middleware/auth.middleware.ts';
import { StudentProfile } from '../models/StudentProfile.ts';
import { successResponse, errorResponse } from '../utils/response.ts';

export class AssessmentController {
  async getQuestions(_req: Request, res: Response, next: NextFunction) {
    try {
      const questions = await assessmentService.getActiveQuestions();
      res.json(successResponse(questions));
    } catch (err) {
      next(err);
    }
  }

  async evaluate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { answers } = req.body;
      if (!answers || Object.keys(answers).length === 0) {
        return res.status(400).json(errorResponse('VALIDATION_ERROR', 'Answers must be provided'));
      }

      let studentId = req.studentProfile?._id?.toString();

      if (!studentId) {
        let demoProfile = await StudentProfile.findOne({ fullName: 'Demo Student' });
        if (!demoProfile) {
          demoProfile = await StudentProfile.findOne();
        }
        studentId = demoProfile ? String(demoProfile._id) : '000000000000000000000001';
      }

      const result = await assessmentService.evaluateAndSave({
        studentId,
        answers,
      });

      res.status(201).json(successResponse(result, 'Assessment evaluated and stored in database'));
    } catch (err) {
      next(err);
    }
  }

  async getLatest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.studentProfile?._id?.toString() || '000000000000000000000001';
      const latest = await assessmentService.getLatestAssessment(studentId);
      res.json(successResponse(latest));
    } catch (err) {
      next(err);
    }
  }

  async getHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.studentProfile?._id?.toString() || '000000000000000000000001';
      const history = await assessmentService.getAssessmentHistory(studentId);
      res.json(successResponse(history));
    } catch (err) {
      next(err);
    }
  }
}

export const assessmentController = new AssessmentController();
