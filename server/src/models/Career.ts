import mongoose, { Document, Schema } from 'mongoose';

export interface ICareer extends Document {
  title: string;
  category: string;
  stream: string;
  description: string;
  requiredSkills: string[];
  degrees: string[];
  averageStartingSalaryLPA: number;
  growthPotential: 'Very High' | 'High' | 'Moderate';
  roadmap: string[];
  relatedCourses: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CareerSchema = new Schema<ICareer>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    stream: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    requiredSkills: [{ type: String }],
    degrees: [{ type: String }],
    averageStartingSalaryLPA: {
      type: Number,
      required: true,
    },
    growthPotential: {
      type: String,
      enum: ['Very High', 'High', 'Moderate'],
      default: 'High',
    },
    roadmap: [{ type: String }],
    relatedCourses: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Career = mongoose.models.Career || mongoose.model<ICareer>('Career', CareerSchema);
