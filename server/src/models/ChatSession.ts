import mongoose, { Document, Schema } from 'mongoose';

export interface IChatSession extends Document {
  studentId?: mongoose.Types.ObjectId;
  title: string;
  topic?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'StudentProfile',
      default: null,
      index: true,
    },
    title: {
      type: String,
      default: 'Career Advisory Session',
    },
    topic: {
      type: String,
      default: 'General Guidance',
    },
  },
  {
    timestamps: true,
  }
);

export const ChatSession =
  mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);

export interface IChatMessage extends Document {
  sessionId: mongoose.Types.ObjectId;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'ChatSession',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'model', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: String,
      default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  },
  {
    timestamps: true,
  }
);

export const ChatMessage =
  mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
