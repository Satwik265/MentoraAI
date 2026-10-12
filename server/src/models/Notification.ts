import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'ADMISSION_DEADLINE' | 'COUNSELLING' | 'DOCUMENT_VERIFICATION' | 'SEAT_ALLOTMENT' | 'SCHOLARSHIP_DEADLINE' | 'SYSTEM';
  read: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['ADMISSION_DEADLINE', 'COUNSELLING', 'DOCUMENT_VERIFICATION', 'SEAT_ALLOTMENT', 'SCHOLARSHIP_DEADLINE', 'SYSTEM'],
      default: 'SYSTEM',
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Notification =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
