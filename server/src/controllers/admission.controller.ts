import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.ts';
import { admissionService } from '../services/admission.service.ts';
import { StudentProfile } from '../models/StudentProfile.ts';
import { successResponse, errorResponse } from '../utils/response.ts';

export class AdmissionController {
  private resolveStudentId = async (req: AuthRequest): Promise<string> => {
    if (req.studentProfile?._id) {
      return String(req.studentProfile._id);
    }
    const demo = await StudentProfile.findOne();
    return demo ? String(demo._id) : '000000000000000000000001';
  };

  getAdmissions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const studentId = await this.resolveStudentId(req);
      const admissions = await admissionService.getStudentAdmissions(studentId);
      res.json(successResponse(admissions));
    } catch (err) {
      next(err);
    }
  };

  createAdmission = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const studentId = await this.resolveStudentId(req);
      const {
        collegeId,
        courseId,
        collegeName,
        courseName,
        examName,
        applicationNumber,
        status,
        applicationDeadline,
        actionRequired,
        notes,
      } = req.body;

      if (!collegeId) {
        return res.status(400).json(errorResponse('VALIDATION_ERROR', 'collegeId is required'));
      }

      const admission = await admissionService.createAdmission(studentId, {
        collegeId,
        courseId,
        collegeName,
        courseName,
        examName,
        applicationNumber,
        status,
        applicationDeadline,
        actionRequired,
        notes,
      });

      res.status(201).json(successResponse(admission, 'Application tracked successfully'));
    } catch (err) {
      next(err);
    }
  };

  updateAdmission = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const studentId = await this.resolveStudentId(req);
      const { status, actionRequired } = req.body;
      const updated = await admissionService.updateAdmissionStatus(
        req.params.id,
        studentId,
        status,
        actionRequired
      );
      res.json(successResponse(updated, 'Application status updated'));
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json(errorResponse('NOT_FOUND', err.message));
      }
      next(err);
    }
  };

  deleteAdmission = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const studentId = await this.resolveStudentId(req);
      await admissionService.deleteAdmission(req.params.id, studentId);
      res.json(successResponse({ deleted: true }, 'Application removed from tracking'));
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json(errorResponse('NOT_FOUND', err.message));
      }
      next(err);
    }
  };
}

export const admissionController = new AdmissionController();
