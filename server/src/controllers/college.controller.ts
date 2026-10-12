import { Request, Response, NextFunction } from 'express';
import { collegeService } from '../services/college.service.ts';
import { successResponse, errorResponse } from '../utils/response.ts';

export class CollegeController {
  async getColleges(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, state, city, type, stream, maxFee, hostelAvailable, page, limit } = req.query;

      const result = await collegeService.getColleges({
        query: query ? String(query) : undefined,
        state: state ? String(state) : undefined,
        city: city ? String(city) : undefined,
        type: type ? String(type) : undefined,
        stream: stream ? String(stream) : undefined,
        maxFee: maxFee ? Number(maxFee) : undefined,
        hostelAvailable: hostelAvailable !== undefined ? hostelAvailable === 'true' : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });

      res.json(successResponse(result));
    } catch (err) {
      next(err);
    }
  }

  async getCollegeById(req: Request, res: Response, next: NextFunction) {
    try {
      const college = await collegeService.getCollegeById(req.params.id);
      if (!college) {
        return res.status(404).json(errorResponse('NOT_FOUND', 'Government college not found'));
      }
      res.json(successResponse(college));
    } catch (err) {
      next(err);
    }
  }

  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await collegeService.getCollegeCourses(req.params.id);
      res.json(successResponse(courses));
    } catch (err) {
      next(err);
    }
  }

  async getCutoffs(req: Request, res: Response, next: NextFunction) {
    try {
      const cutoffs = await collegeService.getCollegeCutoffs(req.params.id);
      res.json(successResponse(cutoffs));
    } catch (err) {
      next(err);
    }
  }
}

export const collegeController = new CollegeController();
