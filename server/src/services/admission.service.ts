import { Admission, IAdmission, AdmissionStatus } from '../models/Admission.ts';
import { College } from '../models/College.ts';
import { StudentProfile } from '../models/StudentProfile.ts';
import { Notification } from '../models/Notification.ts';

export class AdmissionService {
  async getStudentAdmissions(studentId: string) {
    return await Admission.find({ studentId }).sort({ updatedAt: -1 }).lean();
  }

  async createAdmission(studentId: string, data: {
    collegeId: string;
    courseId?: string;
    collegeName?: string;
    courseName?: string;
    examName?: string;
    applicationNumber?: string;
    status?: AdmissionStatus;
    applicationDeadline?: string;
    actionRequired?: string;
    notes?: string;
  }) {
    let college = null;
    if (data.collegeId.match(/^[0-9a-fA-F]{24}$/)) {
      college = await College.findById(data.collegeId);
    }
    if (!college) {
      college = await College.findOne({ slug: data.collegeId });
    }

    const collegeName = college ? college.name : (data.collegeName || 'Target College');
    const collegeId = college ? college._id : data.collegeId;

    const newAdmission = await Admission.create({
      studentId,
      collegeId,
      courseId: data.courseId && data.courseId.match(/^[0-9a-fA-F]{24}$/) ? data.courseId : null,
      collegeName,
      courseName: data.courseName || 'Undergraduate Degree',
      examName: data.examName || 'State Counseling / CUET',
      applicationNumber: data.applicationNumber || 'MAI-' + Math.floor(100000 + Math.random() * 900000),
      status: data.status || 'APPLIED',
      applicationDeadline: data.applicationDeadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      actionRequired: data.actionRequired || 'Upload 10th/12th Marksheet and Domicile Certificate',
      notes: data.notes || 'Tracked through MentoraAI Portal',
    });

    const studentProfile = await StudentProfile.findById(studentId);
    if (studentProfile) {
      await Notification.create({
        userId: studentProfile.userId,
        title: 'New Admission Tracked',
        message: `You are now tracking ${collegeName} (${newAdmission.courseName}). Deadline: ${newAdmission.applicationDeadline}`,
        type: 'ADMISSION_DEADLINE',
      });
    }

    return newAdmission;
  }

  async updateAdmissionStatus(id: string, studentId: string, status: AdmissionStatus, actionRequired?: string) {
    const admission = await Admission.findOne({ _id: id, studentId });
    if (!admission) {
      throw { statusCode: 404, message: 'Admission application record not found' };
    }

    admission.status = status;
    if (actionRequired) admission.actionRequired = actionRequired;
    await admission.save();

    return admission;
  }

  async deleteAdmission(id: string, studentId: string) {
    const result = await Admission.findOneAndDelete({ _id: id, studentId });
    if (!result) {
      throw { statusCode: 404, message: 'Admission application record not found' };
    }
    return true;
  }
}

export const admissionService = new AdmissionService();
