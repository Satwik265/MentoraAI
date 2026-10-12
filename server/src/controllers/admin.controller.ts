import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.ts';
import { StudentProfile } from '../models/StudentProfile.ts';
import { College } from '../models/College.ts';
import { Course } from '../models/Course.ts';
import { Cutoff } from '../models/Cutoff.ts';
import { Scholarship } from '../models/Scholarship.ts';
import { Alumni } from '../models/Alumni.ts';
import { Feedback } from '../models/Feedback.ts';
import { Assessment } from '../models/Assessment.ts';
import { Admission } from '../models/Admission.ts';
import { AuditLog } from '../models/AuditLog.ts';
import { successResponse } from '../utils/response.ts';

export class AdminController {
  async getDashboardStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const [
        totalStudents,
        totalColleges,
        totalCourses,
        totalCutoffs,
        totalScholarships,
        totalAlumni,
        completedAssessments,
        trackedAdmissions,
        totalFeedback,
      ] = await Promise.all([
        StudentProfile.countDocuments(),
        College.countDocuments(),
        Course.countDocuments(),
        Cutoff.countDocuments(),
        Scholarship.countDocuments(),
        Alumni.countDocuments(),
        Assessment.countDocuments({ status: 'COMPLETED' }),
        Admission.countDocuments(),
        Feedback.countDocuments(),
      ]);

      res.json(
        successResponse({
          totalStudents,
          totalColleges,
          totalCourses,
          totalCutoffs,
          totalScholarships,
          totalAlumni,
          completedAssessments,
          trackedAdmissions,
          totalFeedback,
          siMetric: {
            problemStatementId: '25094',
            teamName: 'Code Jesters',
            targetDemographic: '2.5M+ youth across J&K and tier-2/3 regions',
            udiseDropoutBaselinePercent: 11.5,
            ugcCollegeVacancyPercent: 68.0,
          },
        })
      );
    } catch (err) {
      next(err);
    }
  }

  async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50).lean();
      res.json(successResponse(logs));
    } catch (err) {
      next(err);
    }
  }

  async getPendingFeedback(_req: Request, res: Response, next: NextFunction) {
    try {
      const pending = await Feedback.find({ moderationStatus: 'PENDING' }).populate('collegeId').lean();
      res.json(successResponse(pending));
    } catch (err) {
      next(err);
    }
  }

  async moderateFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const updated = await Feedback.findByIdAndUpdate(
        req.params.id,
        { moderationStatus: status },
        { new: true }
      );
      res.json(successResponse(updated, `Review marked as ${status}`));
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();
