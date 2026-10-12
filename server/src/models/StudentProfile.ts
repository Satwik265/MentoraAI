import mongoose, { Document, Schema } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  dateOfBirth?: string;
  gender?: string;
  state: string;
  district?: string;
  city?: string;
  language: string;
  category: 'GEN' | 'OBC' | 'SC' | 'ST' | 'EWS';
  annualFamilyIncome: number;
  ruralOrUrban: 'Rural' | 'Urban' | 'Semi-Urban';
  disabilityStatus: boolean;
  phone?: string;
  classGrade: string;
  targetStream?: string;
  profileCompletion: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      default: 'Not Specified',
    },
    state: {
      type: String,
      default: 'Jammu & Kashmir',
      index: true,
    },
    district: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'en',
    },
    category: {
      type: String,
      enum: ['GEN', 'OBC', 'SC', 'ST', 'EWS'],
      default: 'GEN',
      index: true,
    },
    annualFamilyIncome: {
      type: Number,
      default: 350000,
    },
    ruralOrUrban: {
      type: String,
      enum: ['Rural', 'Urban', 'Semi-Urban'],
      default: 'Rural',
    },
    disabilityStatus: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: '',
    },
    classGrade: {
      type: String,
      default: 'Class 10 Student',
    },
    targetStream: {
      type: String,
      default: 'Engineering & Technology',
    },
    profileCompletion: {
      type: Number,
      default: 85,
    },
  },
  {
    timestamps: true,
  }
);

export const StudentProfile =
  mongoose.models.StudentProfile || mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
