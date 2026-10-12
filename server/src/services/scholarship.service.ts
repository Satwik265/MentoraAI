import { Scholarship } from '../models/Scholarship.ts';
import { StudentProfile } from '../models/StudentProfile.ts';

export class ScholarshipService {
  async getScholarships(filters?: { category?: string; state?: string; maxIncome?: number }) {
    const query: any = { active: true };

    if (filters?.state && filters.state !== 'All') {
      query.$or = [{ state: filters.state }, { state: 'All India' }];
    }

    if (filters?.maxIncome && filters.maxIncome > 0) {
      query.incomeLimit = { $gte: filters.maxIncome };
    }

    if (filters?.category && filters.category !== 'All') {
      query.$or = [
        { category: { $regex: filters.category, $options: 'i' } },
        { name: { $regex: filters.category, $options: 'i' } },
      ];
    }

    return await Scholarship.find(query).sort({ amountAnnual: -1 }).lean();
  }

  async getScholarshipById(id: string) {
    return await Scholarship.findById(id).lean();
  }

  async matchScholarshipsForStudent(studentId: string) {
    const student = await StudentProfile.findById(studentId).lean();
    if (!student) {
      return await this.getScholarships();
    }

    const matched = await Scholarship.find({
      active: true,
      incomeLimit: { $gte: student.annualFamilyIncome },
      $or: [{ state: student.state }, { state: 'All India' }],
    }).lean();

    return matched;
  }
}

export const scholarshipService = new ScholarshipService();
