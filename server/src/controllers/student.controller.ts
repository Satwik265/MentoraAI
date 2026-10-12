import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.ts';
import { StudentProfile } from '../models/StudentProfile.ts';
import { AcademicRecord } from '../models/AcademicRecord.ts';
import { Assessment } from '../models/Assessment.ts';
import { Admission } from '../models/Admission.ts';
import { successResponse, errorResponse } from '../utils/response.ts';

export class StudentController {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.studentProfile?._id;
      if (!studentId) {
        return res.status(404).json(errorResponse('NOT_FOUND', 'Student profile not found'));
      }
      const profile = await StudentProfile.findById(studentId);
      res.json(successResponse(profile));
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.studentProfile?._id;
      if (!studentId) {
        return res.status(404).json(errorResponse('NOT_FOUND', 'Student profile not found'));
      }

      const allowedFields = [
        'fullName',
        'dateOfBirth',
        'gender',
        'state',
        'district',
        'city',
        'language',
        'category',
        'annualFamilyIncome',
        'ruralOrUrban',
        'disabilityStatus',
        'phone',
        'classGrade',
        'targetStream',
      ];

      const updates: any = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      const updated = await StudentProfile.findByIdAndUpdate(studentId, updates, { new: true });
      res.json(successResponse(updated, 'Profile updated successfully'));
    } catch (err) {
      next(err);
    }
  }

  async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.studentProfile?._id;
      const [profile, academics, latestAssessment, admissions] = await Promise.all([
        studentId ? StudentProfile.findById(studentId).lean() : null,
        studentId ? AcademicRecord.find({ studentId }).lean() : [],
        studentId ? Assessment.findOne({ studentId }).sort({ createdAt: -1 }).lean() : null,
        studentId ? Admission.find({ studentId }).lean() : [],
      ]);

      res.json(
        successResponse({
          profile,
          academics,
          latestAssessment,
          admissionsCount: admissions.length,
          admissions,
        })
      );
    } catch (err) {
      next(err);
    }
  }

  async getAcademics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.studentProfile?._id;
      if (!studentId) return res.status(404).json(errorResponse('NOT_FOUND', 'Profile not found'));

      const records = await AcademicRecord.find({ studentId }).sort({ year: -1 });
      res.json(successResponse(records));
    } catch (err) {
      next(err);
    }
  }

  async addAcademicRecord(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.studentProfile?._id;
      if (!studentId) return res.status(404).json(errorResponse('NOT_FOUND', 'Profile not found'));

      const record = await AcademicRecord.create({
        studentId,
        ...req.body,
      });

      res.status(201).json(successResponse(record, 'Academic record added'));
    } catch (err) {
      next(err);
    }
  }
}

export const studentController = new StudentController();
