import mongoose, { Document, Schema } from 'mongoose';

export interface ICollege extends Document {
  name: string;
  shortName: string;
  slug: string;
  type: 'IIT' | 'NIT' | 'Central University' | 'State University' | 'Government Polytechnic' | 'Medical College' | 'ITI';
  state: string;
  district?: string;
  city: string;
  address: string;
  website: string;
  establishedYear: number;
  nirfRank?: number;
  naacGrade: string;
  campusAreaAcres: number;
  annualFeesAvg: number;
  description: string;
  governmentVerified: boolean;
  hostelAvailable: boolean;
  hostelFeeAnnual: number;
  placementInfo: {
    avgPackageLPA: number;
    highestPackageLPA: number;
    topRecruiters: string[];
  };
  admissionTimeline: {
    exam: string;
    registrationStart: string;
    registrationEnd: string;
    examDate: string;
    counselingDate: string;
    currentStatus: 'Registration Open' | 'Admit Card Issued' | 'Counseling Active' | 'Round 1 Allotment';
  };
  governmentScholarshipsSupported: string[];
  crowdsourcedRating: {
    overall: number;
    faculty: number;
    placements: number;
    infrastructure: number;
    reviewCount: number;
  };
  source: string;
  sourceUrl: string;
  lastVerifiedAt: Date;
  verificationStatus: 'Verified' | 'Pending' | 'Demo';
  createdAt: Date;
  updatedAt: Date;
}

const CollegeSchema = new Schema<ICollege>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    shortName: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['IIT', 'NIT', 'Central University', 'State University', 'Government Polytechnic', 'Medical College', 'ITI'],
      required: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
      index: true,
    },
    district: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    address: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    establishedYear: {
      type: Number,
      required: true,
    },
    nirfRank: {
      type: Number,
      default: null,
      index: true,
    },
    naacGrade: {
      type: String,
      default: 'A',
    },
    campusAreaAcres: {
      type: Number,
      default: 50,
    },
    annualFeesAvg: {
      type: Number,
      default: 45000,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    governmentVerified: {
      type: Boolean,
      default: true,
    },
    hostelAvailable: {
      type: Boolean,
      default: true,
    },
    hostelFeeAnnual: {
      type: Number,
      default: 20000,
    },
    placementInfo: {
      avgPackageLPA: { type: Number, default: 8.5 },
      highestPackageLPA: { type: Number, default: 35.0 },
      topRecruiters: [{ type: String }],
    },
    admissionTimeline: {
      exam: { type: String, default: 'Entrance Exam' },
      registrationStart: { type: String, default: '2025-03-01' },
      registrationEnd: { type: String, default: '2025-05-30' },
      examDate: { type: String, default: '2025-06-15' },
      counselingDate: { type: String, default: '2025-07-01' },
      currentStatus: {
        type: String,
        enum: ['Registration Open', 'Admit Card Issued', 'Counseling Active', 'Round 1 Allotment'],
        default: 'Counseling Active',
      },
    },
    governmentScholarshipsSupported: [{ type: String }],
    crowdsourcedRating: {
      overall: { type: Number, default: 4.5 },
      faculty: { type: Number, default: 4.5 },
      placements: { type: Number, default: 4.5 },
      infrastructure: { type: Number, default: 4.5 },
      reviewCount: { type: Number, default: 0 },
    },
    source: {
      type: String,
      default: 'MentoraAI SIH 2025 Demo Seed / Government Gazette',
    },
    sourceUrl: {
      type: String,
      default: 'https://ais-dev-lfdvnblovy5iygveeeyg6p-420595702419.asia-southeast1.run.app',
    },
    lastVerifiedAt: {
      type: Date,
      default: Date.now,
    },
    verificationStatus: {
      type: String,
      enum: ['Verified', 'Pending', 'Demo'],
      default: 'Demo',
    },
  },
  {
    timestamps: true,
  }
);

export const College = mongoose.models.College || mongoose.model<ICollege>('College', CollegeSchema);
