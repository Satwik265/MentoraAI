import mongoose, { Document, Schema } from 'mongoose';

export interface IAlumni extends Document {
  name: string;
  college: string;
  degree: string;
  graduationYear: number;
  career: string;
  company: string;
  location: string;
  originRegion: string;
  bio: string;
  profileImage: string;
  verified: boolean;
  story: string;
  overcomingDropoutRisk: string;
  skills: string[];
  advice: string;
  mentorshipTopics: string[];
  availabilityStatus: 'Available for Mentorship' | 'Reviewing Inquiries';
  createdAt: Date;
  updatedAt: Date;
}

const AlumniSchema = new Schema<IAlumni>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    college: {
      type: String,
      required: true,
      index: true,
    },
    degree: {
      type: String,
      required: true,
    },
    graduationYear: {
      type: Number,
      required: true,
    },
    career: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    originRegion: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    verified: {
      type: Boolean,
      default: true,
    },
    story: {
      type: String,
      required: true,
    },
    overcomingDropoutRisk: {
      type: String,
      required: true,
    },
    skills: [{ type: String }],
    advice: {
      type: String,
      required: true,
    },
    mentorshipTopics: [{ type: String }],
    availabilityStatus: {
      type: String,
      enum: ['Available for Mentorship', 'Reviewing Inquiries'],
      default: 'Available for Mentorship',
    },
  },
  {
    timestamps: true,
  }
);

export const Alumni = mongoose.models.Alumni || mongoose.model<IAlumni>('Alumni', AlumniSchema);
