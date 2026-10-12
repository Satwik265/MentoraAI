import { Alumni } from '../models/Alumni.ts';
import { Notification } from '../models/Notification.ts';

export class AlumniService {
  async getAllAlumni() {
    return await Alumni.find({ verified: true }).sort({ graduationYear: -1 }).lean();
  }

  async getAlumniById(id: string) {
    return await Alumni.findById(id).lean();
  }

  async submitQuestion(alumniId: string, data: {
    studentName: string;
    studentClass: string;
    message: string;
  }) {
    const alumni = await Alumni.findById(alumniId);
    if (!alumni) {
      throw { statusCode: 404, message: 'Alumni mentor not found' };
    }

    return {
      success: true,
      inquiryId: 'INQ-' + Date.now(),
      alumniName: alumni.name,
      studentName: data.studentName,
      message: data.message,
      submittedAt: new Date(),
      status: 'SUBMITTED_TO_MENTOR',
    };
  }
}

export const alumniService = new AlumniService();
