import mongoose, { Document, Schema } from 'mongoose';

export interface IScholarship extends Document {
  name: string;
  provider: string;
  description: string;
  eligibility: string[];
  incomeLimit: number;
  category: string[];
  state: string;
  academicLevel: string[];
  amountAnnual: number;
  deadline: string;
  officialUrl: string;
  keyBenefits: string;
  requiredDocuments: string[];
  active: boolean;
  source: string;
  sourceUrl: string;
  lastVerifiedAt: Date;
  verificationStatus: 'Verified' | 'Pending' | 'Demo';
  createdAt: Date;
  updatedAt: Date;
}

const ScholarshipSchema = new Schema<IScholarship>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    provider: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    eligibility: [{ type: String }],
    incomeLimit: {
      type: Number,
      required: true,
      index: true,
    },
    category: [{ type: String }],
    state: {
      type: String,
      default: 'All India',
      index: true,
    },
    academicLevel: [{ type: String }],
    amountAnnual: {
      type: Number,
      required: true,
    },
    deadline: {
      type: String,
      required: true,
    },
    officialUrl: {
      type: String,
      required: true,
    },
    keyBenefits: {
      type: String,
      required: true,
    },
    requiredDocuments: [{ type: String }],
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    source: {
      type: String,
      default: 'National Scholarship Portal (NSP) / AICTE DEMO',
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

export const Scholarship =
  mongoose.models.Scholarship || mongoose.model<IScholarship>('Scholarship', ScholarshipSchema);
