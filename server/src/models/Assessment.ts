import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessment extends Document {
  studentId: mongoose.Types.ObjectId;
  assessmentType: string;
  answers: Map<string, string>;
  status: 'STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  startedAt: Date;
  completedAt?: Date;
  scores: {
    tech: number;
    medical: number;
    commerce: number;
    arts: number;
    polytechnic: number;
    analytical: number;
    creative: number;
    social: number;
    entrepreneurial: number;
  };
  recommendations: {
    recommendedStream: string;
    confidenceScore: number;
    topCareers: string[];
    topCourses: string[];
    suggestedColleges: string[];
    skillRoadmap: string[];
  };
  modelVersion: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
      index: true,
    },
    assessmentType: {
      type: String,
      default: 'COMPREHENSIVE_RIASEC_STREAM',
    },
    answers: {
      type: Map,
      of: String,
      default: {},
    },
    status: {
      type: String,
      enum: ['STARTED', 'IN_PROGRESS', 'COMPLETED'],
      default: 'COMPLETED',
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    scores: {
      tech: { type: Number, default: 0 },
      medical: { type: Number, default: 0 },
      commerce: { type: Number, default: 0 },
      arts: { type: Number, default: 0 },
      polytechnic: { type: Number, default: 0 },
      analytical: { type: Number, default: 0 },
      creative: { type: Number, default: 0 },
      social: { type: Number, default: 0 },
      entrepreneurial: { type: Number, default: 0 },
    },
    recommendations: {
      recommendedStream: { type: String, required: true },
      confidenceScore: { type: Number, default: 85 },
      topCareers: [{ type: String }],
      topCourses: [{ type: String }],
      suggestedColleges: [{ type: String }],
      skillRoadmap: [{ type: String }],
    },
    modelVersion: {
      type: String,
      default: 'RF_SCIKIT_V2_COMPATIBLE',
    },
  },
  {
    timestamps: true,
  }
);

export const Assessment =
  mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
