import { College } from '../models/College.ts';
import { Course } from '../models/Course.ts';
import { Cutoff } from '../models/Cutoff.ts';

export interface PredictAdmissionInput {
  collegeId: string;
  courseId: string;
  studentScore: number;
  scoreType: 'rank' | 'percentage';
  category: 'GEN' | 'OBC' | 'SC' | 'ST' | 'EWS';
  quota: 'AI' | 'HS' | 'OS';
}

export class CutoffService {
  async predict(input: PredictAdmissionInput) {
    let college = await College.findOne({ slug: input.collegeId }).lean();
    if (!college && input.collegeId.match(/^[0-9a-fA-F]{24}$/)) {
      college = await College.findById(input.collegeId).lean();
    }

    if (!college) {
      throw { statusCode: 404, message: 'Target government college not found' };
    }

    let course = null;
    if (input.courseId.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(input.courseId).lean();
    }
    if (!course) {
      course = await Course.findOne({
        collegeId: college._id,
        $or: [{ _id: input.courseId as any }, { name: { $regex: input.courseId, $options: 'i' } }],
      }).lean();
    }
    if (!course) {
      course = await Course.findOne({ collegeId: college._id }).lean();
    }

    if (!course) {
      throw { statusCode: 404, message: 'Specified academic course not found' };
    }

    const cutoffs = await Cutoff.find({
      collegeId: college._id,
      courseId: course._id,
    }).lean();

    let matchedCutoff =
      cutoffs.find(c => c.category === input.category && c.quota === input.quota) ||
      cutoffs.find(c => c.category === input.category) ||
      cutoffs[0];

    const fallbackMinPercentage = 75;
    const fallbackClosingRank = 35000;

    let chancePercentage = 50;
    let probability: 'High' | 'Moderate' | 'Reach' | 'Low' = 'Moderate';
    let reasoning = '';

    if (input.scoreType === 'percentage') {
      const benchmarkPercentage = matchedCutoff?.minPercentage || fallbackMinPercentage;
      if (input.studentScore >= benchmarkPercentage + 6) {
        chancePercentage = 95;
        probability = 'High';
        reasoning = `Your board score (${input.studentScore}%) exceeds the historical cutoff threshold (${benchmarkPercentage}%) comfortably for ${input.category} quota. High probability in Round 1.`;
      } else if (input.studentScore >= benchmarkPercentage) {
        chancePercentage = 78;
        probability = 'High';
        reasoning = `Your board score (${input.studentScore}%) is above the historical cutoff threshold (${benchmarkPercentage}%). High probability in initial counseling rounds.`;
      } else if (input.studentScore >= benchmarkPercentage - 6) {
        chancePercentage = 54;
        probability = 'Moderate';
        reasoning = `Your board score (${input.studentScore}%) is within 6% of the historical cut-off mark (${benchmarkPercentage}%). Likely to clear in subsequent rounds or institutional mop-up.`;
      } else {
        chancePercentage = 22;
        probability = 'Reach';
        reasoning = `Your score (${input.studentScore}%) is below the typical historical closing mark (${benchmarkPercentage}%). We suggest maintaining backup options or applying via specialized state domicile quota.`;
      }
    } else {
      const benchmarkClosingRank = matchedCutoff?.closingRank || fallbackClosingRank;
      if (input.studentScore <= benchmarkClosingRank * 0.7) {
        chancePercentage = 98;
        probability = 'High';
        reasoning = `Your rank (#${input.studentScore}) is comfortably inside the closing rank (#${benchmarkClosingRank}) for ${input.category} candidates.`;
      } else if (input.studentScore <= benchmarkClosingRank) {
        chancePercentage = 84;
        probability = 'High';
        reasoning = `Your rank (#${input.studentScore}) clears historical counseling closing bounds (#${benchmarkClosingRank}).`;
      } else if (input.studentScore <= benchmarkClosingRank * 1.35) {
        chancePercentage = 52;
        probability = 'Moderate';
        reasoning = `Your rank (#${input.studentScore}) is competitive for Round 3 or CSAB special vacant seats.`;
      } else {
        chancePercentage = 18;
        probability = 'Reach';
        reasoning = `Your rank (#${input.studentScore}) is above typical closing rank (#${benchmarkClosingRank}). Consider applying to regional government polytechnics or state universities.`;
      }
    }

    return {
      collegeName: college.name,
      courseName: course.name,
      chancePercentage,
      probability,
      reasoning,
      historicalClosing: matchedCutoff || {
        category: input.category,
        quota: input.quota,
        closingRank: fallbackClosingRank,
        minPercentage: fallbackMinPercentage,
      },
      seatAvailability: course.seatsBreakdown,
      annualFee: course.annualFee,
      avgPackageLPA: course.avgPackageLPA,
      timeline: college.admissionTimeline,
      disclaimer: 'Predictions are advisory estimates based on historical cutoffs and do not guarantee official admission.',
    };
  }
}

export const cutoffService = new CutoffService();
