import mongoose, { Document, Schema } from 'mongoose';

export type AdmissionStatus =
  | 'APPLIED'
  | 'DOCUMENTS_VERIFIED'
  | 'MERIT_LIST'
  | 'COUNSELLING'
  | 'SEAT_ALLOTTED'
  | 'CONFIRMED'
  | 'REJECTED';

export interface IAdmission extends Document {
  studentId: mongoose.Types.ObjectId;
  collegeId: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  collegeName: string;
  courseName: string;
  examName: string;
  applicationNumber: string;
  authority: string;
  status: AdmissionStatus;
  applicationDeadline: string;
  counsellingDate?: string;
  seatAllotmentDate?: string;
  actionRequired: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionSchema = new Schema<IAdmission>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
      index: true,
    },
    collegeId: {
      type: Schema.Types.ObjectId,
      ref: 'College',
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
    collegeName: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    examName: {
      type: String,
      default: 'Central / State Exam',
    },
    applicationNumber: {
      type: String,
      required: true,
      index: true,
    },
    authority: {
      type: String,
      default: 'State/Central Counseling Authority',
    },
    status: {
      type: String,
      enum: ['APPLIED', 'DOCUMENTS_VERIFIED', 'MERIT_LIST', 'COUNSELLING', 'SEAT_ALLOTTED', 'CONFIRMED', 'REJECTED'],
      default: 'APPLIED',
      index: true,
    },
    applicationDeadline: {
      type: String,
      required: true,
    },
    counsellingDate: {
      type: String,
      default: '',
    },
    seatAllotmentDate: {
      type: String,
      default: '',
    },
    actionRequired: {
      type: String,
      default: 'Upload verification documents',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Admission =
  mongoose.models.Admission || mongoose.model<IAdmission>('Admission', AdmissionSchema);
