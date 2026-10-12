import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  collegeId: mongoose.Types.ObjectId;
  name: string;
  degree: string;
  stream: 'Engineering & Tech' | 'Medical & Healthcare' | 'Pure Sciences' | 'Commerce & Finance' | 'Arts & Humanities' | 'Polytechnic & Vocational';
  durationYears: number;
  annualFee: number;
  eligibility: string;
  totalSeats: number;
  seatsBreakdown: {
    general: number;
    obc: number;
    sc: number;
    st: number;
    ews: number;
    pwd: number;
  };
  acceptedExams: string[];
  avgPackageLPA: number;
  highestPackageLPA: number;
  description: string;
  source: string;
  sourceUrl: string;
  lastVerifiedAt: Date;
  verificationStatus: 'Verified' | 'Pending' | 'Demo';
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    collegeId: {
      type: Schema.Types.ObjectId,
      ref: 'College',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    degree: {
      type: String,
      required: true,
      index: true,
    },
    stream: {
      type: String,
      enum: ['Engineering & Tech', 'Medical & Healthcare', 'Pure Sciences', 'Commerce & Finance', 'Arts & Humanities', 'Polytechnic & Vocational'],
      required: true,
      index: true,
    },
    durationYears: {
      type: Number,
      required: true,
    },
    annualFee: {
      type: Number,
      required: true,
      index: true,
    },
    eligibility: {
      type: String,
      default: 'Passed 10th or 12th board from recognized institution',
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    seatsBreakdown: {
      general: { type: Number, default: 0 },
      obc: { type: Number, default: 0 },
      sc: { type: Number, default: 0 },
      st: { type: Number, default: 0 },
      ews: { type: Number, default: 0 },
      pwd: { type: Number, default: 0 },
    },
    acceptedExams: [{ type: String }],
    avgPackageLPA: {
      type: Number,
      default: 6.0,
    },
    highestPackageLPA: {
      type: Number,
      default: 20.0,
    },
    description: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: 'State & Central Admissions Authority DEMO',
    },
    sourceUrl: {
      type: String,
      default: '',
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

export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
