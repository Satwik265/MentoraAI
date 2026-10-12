import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessmentQuestion extends Document {
  questionKey: string;
  category: 'Aptitude' | 'RIASEC' | 'Interest' | 'Academic' | 'SocioEconomic';
  questionText: string;
  questionHindi: string;
  description?: string;
  options: Array<{
    optionId: string;
    text: string;
    textHindi: string;
    weights: {
      tech?: number;
      medical?: number;
      commerce?: number;
      arts?: number;
      polytechnic?: number;
      analytical?: number;
      creative?: number;
      social?: number;
      entrepreneurial?: number;
    };
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentQuestionSchema = new Schema<IAssessmentQuestion>(
  {
    questionKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['Aptitude', 'RIASEC', 'Interest', 'Academic', 'SocioEconomic'],
      required: true,
      index: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    questionHindi: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    options: [
      {
        optionId: { type: String, required: true },
        text: { type: String, required: true },
        textHindi: { type: String, default: '' },
        weights: {
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
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AssessmentQuestion =
  mongoose.models.AssessmentQuestion ||
  mongoose.model<IAssessmentQuestion>('AssessmentQuestion', AssessmentQuestionSchema);
