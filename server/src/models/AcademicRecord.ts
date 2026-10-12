import mongoose, { Document, Schema } from 'mongoose';

export interface IAcademicRecord extends Document {
  studentId: mongoose.Types.ObjectId;
  qualification: 'Class 10' | 'Class 12' | 'Diploma' | 'Graduation';
  board: string;
  institution: string;
  year: number;
  percentage?: number;
  cgpa?: number;
  subjects: Array<{ name: string; marksObtained: number; maxMarks: number }>;
  createdAt: Date;
  updatedAt: Date;
}

const AcademicRecordSchema = new Schema<IAcademicRecord>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
      index: true,
    },
    qualification: {
      type: String,
      enum: ['Class 10', 'Class 12', 'Diploma', 'Graduation'],
      required: true,
    },
    board: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      default: null,
    },
    cgpa: {
      type: Number,
      default: null,
    },
    subjects: [
      {
        name: { type: String, required: true },
        marksObtained: { type: Number, required: true },
        maxMarks: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const AcademicRecord =
  mongoose.models.AcademicRecord || mongoose.model<IAcademicRecord>('AcademicRecord', AcademicRecordSchema);
