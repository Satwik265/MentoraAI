import { Request, Response, NextFunction } from 'express';
import { scholarshipService } from '../services/scholarship.service.ts';
import { AuthRequest } from '../middleware/auth.middleware.ts';
import { successResponse, errorResponse } from '../utils/response.ts';

export class ScholarshipController {
  async getScholarships(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, state, maxIncome } = req.query;
      const scholarships = await scholarshipService.getScholarships({
        category: category ? String(category) : undefined,
        state: state ? String(state) : undefined,
        maxIncome: maxIncome ? Number(maxIncome) : undefined,
      });
      res.json(successResponse(scholarships));
    } catch (err) {
      next(err);
    }
  }

  async getScholarshipById(req: Request, res: Response, next: NextFunction) {
    try {
      const scholarship = await scholarshipService.getScholarshipById(req.params.id);
      if (!scholarship) {
        return res.status(404).json(errorResponse('NOT_FOUND', 'Scholarship scheme not found'));
      }
      res.json(successResponse(scholarship));
    } catch (err) {
      next(err);
    }
  }

  async matchScholarships(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.studentProfile?._id?.toString() || '000000000000000000000001';
      const matched = await scholarshipService.matchScholarshipsForStudent(studentId);
      res.json(successResponse(matched));
    } catch (err) {
      next(err);
    }
  }
}

export const scholarshipController = new ScholarshipController();
