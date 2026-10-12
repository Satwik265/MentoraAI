import { Request, Response, NextFunction } from 'express';
import { alumniService } from '../services/alumni.service.ts';
import { successResponse, errorResponse } from '../utils/response.ts';

export class AlumniController {
  async getAlumni(_req: Request, res: Response, next: NextFunction) {
    try {
      const alumni = await alumniService.getAllAlumni();
      res.json(successResponse(alumni));
    } catch (err) {
      next(err);
    }
  }

  async getAlumniById(req: Request, res: Response, next: NextFunction) {
    try {
      const alumni = await alumniService.getAlumniById(req.params.id);
      if (!alumni) {
        return res.status(404).json(errorResponse('NOT_FOUND', 'Alumni profile not found'));
      }
      res.json(successResponse(alumni));
    } catch (err) {
      next(err);
    }
  }

  async askQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentName, studentClass, message } = req.body;
      if (!message) {
        return res.status(400).json(errorResponse('VALIDATION_ERROR', 'Message cannot be empty'));
      }

      const result = await alumniService.submitQuestion(req.params.id, {
        studentName: studentName || 'Student Scholar',
        studentClass: studentClass || 'Class 12',
        message,
      });

      res.status(201).json(successResponse(result, 'Question transmitted to alumni mentor'));
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json(errorResponse('NOT_FOUND', err.message));
      }
      next(err);
    }
  }
}

export const alumniController = new AlumniController();
