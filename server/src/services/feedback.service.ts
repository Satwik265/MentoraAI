import { Feedback, IFeedback } from '../models/Feedback.ts';
import { College } from '../models/College.ts';

export class FeedbackService {
  async getReviews(collegeId?: string) {
    const filter: any = { moderationStatus: 'APPROVED' };
    if (collegeId && collegeId !== 'All') {
      let college = await College.findOne({ slug: collegeId });
      if (!college && collegeId.match(/^[0-9a-fA-F]{24}$/)) {
        college = await College.findById(collegeId);
      }
      if (college) {
        filter.collegeId = college._id;
      }
    }

    return await Feedback.find(filter).sort({ createdAt: -1 }).lean();
  }

  async addReview(data: {
    studentId?: string;
    collegeId: string;
    studentName?: string;
    courseAndYear?: string;
    rating: number;
    category?: 'hostel' | 'infrastructure' | 'fees' | 'placements' | 'faculty' | 'campus' | 'admission';
    comment: string;
    pros?: string[];
    cons?: string[];
  }) {
    let college = null;
    if (data.collegeId.match(/^[0-9a-fA-F]{24}$/)) {
      college = await College.findById(data.collegeId);
    }
    if (!college) {
      college = await College.findOne({ slug: data.collegeId });
    }

    if (!college) {
      throw { statusCode: 404, message: 'Target college not found' };
    }

    const review = await Feedback.create({
      studentId: data.studentId || null,
      collegeId: college._id,
      studentName: data.studentName || 'Verified Scholar',
      courseAndYear: data.courseAndYear || 'Student',
      rating: data.rating,
      category: data.category || 'campus',
      comment: data.comment,
      pros: data.pros || ['Affordable government fees', 'Good faculty support'],
      cons: data.cons || ['Continuous self-study required'],
      verified: true,
      moderationStatus: 'APPROVED',
      date: new Date().toISOString().split('T')[0],
    });

    const reviews = await Feedback.find({ collegeId: college._id, moderationStatus: 'APPROVED' });
    const avgOverall = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    college.crowdsourcedRating.overall = Number(avgOverall.toFixed(1));
    college.crowdsourcedRating.reviewCount = reviews.length;
    await college.save();

    return review;
  }
}

export const feedbackService = new FeedbackService();
