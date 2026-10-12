import { Request, Response, NextFunction } from 'express';
import { cutoffService } from '../services/cutoff.service.ts';
import { Cutoff } from '../models/Cutoff.ts';
import { successResponse, errorResponse } from '../utils/response.ts';

export class CutoffController {
  async getCutoffs(req: Request, res: Response, next: NextFunction) {
    try {
      const { exam, category, quota } = req.query;
      const filter: any = {};
      if (exam) filter.exam = String(exam);
      if (category) filter.category = String(category);
      if (quota) filter.quota = String(quota);

      const cutoffs = await Cutoff.find(filter).populate('collegeId courseId').limit(100).lean();
      res.json(successResponse(cutoffs));
    } catch (err) {
      next(err);
    }
  }

  async predict(req: Request, res: Response, next: NextFunction) {
    try {
      const { collegeId, courseId, studentScore, scoreType, category, quota } = req.body;
      if (!collegeId || !courseId || studentScore === undefined) {
        return res.status(400).json(errorResponse('VALIDATION_ERROR', 'collegeId, courseId, and studentScore are required'));
      }

      const result = await cutoffService.predict({
        collegeId,
        courseId,
        studentScore: Number(studentScore),
        scoreType: scoreType || 'percentage',
        category: category || 'GEN',
        quota: quota || 'HS',
      });

      res.json(successResponse(result, 'Cutoff probability calculated'));
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json(errorResponse('CUTOFF_ERROR', err.message));
      }
      next(err);
    }
  }
}

export const cutoffController = new CutoffController();
