import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  studentId?: mongoose.Types.ObjectId;
  collegeId: mongoose.Types.ObjectId;
  studentName: string;
  courseAndYear: string;
  rating: number;
  category: 'hostel' | 'infrastructure' | 'fees' | 'placements' | 'faculty' | 'campus' | 'admission';
  comment: string;
  pros: string[];
  cons: string[];
  verified: boolean;
  moderationStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'StudentProfile',
      default: null,
    },
    collegeId: {
      type: Schema.Types.ObjectId,
      ref: 'College',
      required: true,
      index: true,
    },
    studentName: {
      type: String,
      default: 'Verified Student',
    },
    courseAndYear: {
      type: String,
      default: 'Current Scholar',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    category: {
      type: String,
      enum: ['hostel', 'infrastructure', 'fees', 'placements', 'faculty', 'campus', 'admission'],
      default: 'campus',
      index: true,
    },
    comment: {
      type: String,
      required: true,
    },
    pros: [{ type: String }],
    cons: [{ type: String }],
    verified: {
      type: Boolean,
      default: true,
    },
    moderationStatus: {
      type: String,
      enum: ['APPROVED', 'PENDING', 'REJECTED'],
      default: 'APPROVED',
      index: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
