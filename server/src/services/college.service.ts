import { College, ICollege } from '../models/College.ts';
import { Course } from '../models/Course.ts';
import { Cutoff } from '../models/Cutoff.ts';
import { Feedback } from '../models/Feedback.ts';

export interface CollegeFilterOptions {
  query?: string;
  state?: string;
  city?: string;
  type?: string;
  stream?: string;
  maxFee?: number;
  hostelAvailable?: boolean;
  page?: number;
  limit?: number;
}

export class CollegeService {
  async getColleges(filters: CollegeFilterOptions) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(50, Math.max(1, filters.limit || 20));
    const skip = (page - 1) * limit;

    const mongoFilter: any = {};

    if (filters.state && filters.state !== 'All') {
      mongoFilter.state = new RegExp(`^${filters.state}$`, 'i');
    }

    if (filters.type && filters.type !== 'All') {
      mongoFilter.type = filters.type;
    }

    if (filters.city && filters.city !== 'All') {
      mongoFilter.city = new RegExp(`^${filters.city}$`, 'i');
    }

    if (filters.hostelAvailable !== undefined) {
      mongoFilter.hostelAvailable = filters.hostelAvailable;
    }

    if (filters.maxFee && filters.maxFee > 0) {
      mongoFilter.annualFeesAvg = { $lte: filters.maxFee };
    }

    if (filters.query) {
      const q = filters.query.trim();
      mongoFilter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { shortName: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
        { state: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    const [colleges, total] = await Promise.all([
      College.find(mongoFilter)
        .sort({ nirfRank: 1, 'crowdsourcedRating.overall': -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      College.countDocuments(mongoFilter),
    ]);

    const collegeIds = colleges.map(c => c._id);
    const courses = await Course.find({ collegeId: { $in: collegeIds } }).lean();

    let enrichedColleges = colleges.map(col => {
      const colCourses = courses.filter(crs => crs.collegeId.toString() === col._id.toString());
      return {
        ...col,
        id: col.slug || col._id.toString(),
        courses: colCourses.map(crs => ({
          ...crs,
          id: crs._id.toString(),
        })),
      };
    });

    if (filters.stream && filters.stream !== 'All') {
      enrichedColleges = enrichedColleges.filter(c =>
        c.courses.some((crs: any) => crs.stream === filters.stream)
      );
    }

    return {
      colleges: enrichedColleges,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getCollegeById(idOrSlug: string) {
    let college = await College.findOne({ slug: idOrSlug }).lean();
    if (!college && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      college = await College.findById(idOrSlug).lean();
    }

    if (!college) return null;

    const [courses, reviews, cutoffs] = await Promise.all([
      Course.find({ collegeId: college._id }).lean(),
      Feedback.find({ collegeId: college._id, moderationStatus: 'APPROVED' }).sort({ createdAt: -1 }).lean(),
      Cutoff.find({ collegeId: college._id }).lean(),
    ]);

    return {
      ...college,
      id: college.slug || college._id.toString(),
      courses: courses.map(crs => ({ ...crs, id: crs._id.toString() })),
      reviews,
      cutoffs,
    };
  }

  async getCollegeCourses(collegeId: string) {
    return await Course.find({ collegeId }).lean();
  }

  async getCollegeCutoffs(collegeId: string) {
    return await Cutoff.find({ collegeId }).lean();
  }
}

export const collegeService = new CollegeService();
