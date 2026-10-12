import mongoose, { Document, Schema } from 'mongoose';

export interface ICutoff extends Document {
  collegeId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  exam: string;
  academicYear: number;
  category: 'GEN' | 'OBC' | 'SC' | 'ST' | 'EWS';
  quota: 'AI' | 'HS' | 'OS';
  round: number;
  openingRank?: number;
  closingRank?: number;
  minPercentage?: number;
  source: string;
  sourceUrl: string;
  lastVerifiedAt: Date;
  verificationStatus: 'Verified' | 'Pending' | 'Demo';
  createdAt: Date;
  updatedAt: Date;
}

const CutoffSchema = new Schema<ICutoff>(
  {
    collegeId: {
      type: Schema.Types.ObjectId,
      ref: 'College',
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    exam: {
      type: String,
      required: true,
      index: true,
    },
    academicYear: {
      type: Number,
      required: true,
      default: 2024,
      index: true,
    },
    category: {
      type: String,
      enum: ['GEN', 'OBC', 'SC', 'ST', 'EWS'],
      required: true,
      index: true,
    },
    quota: {
      type: String,
      enum: ['AI', 'HS', 'OS'],
      required: true,
      index: true,
    },
    round: {
      type: Number,
      default: 1,
    },
    openingRank: {
      type: Number,
      default: null,
    },
    closingRank: {
      type: Number,
      default: null,
      index: true,
    },
    minPercentage: {
      type: Number,
      default: null,
      index: true,
    },
    source: {
      type: String,
      default: 'JoSAA / CSAB / State BoPEE Official Historical Archive DEMO',
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

export const Cutoff = mongoose.models.Cutoff || mongoose.model<ICutoff>('Cutoff', CutoffSchema);
