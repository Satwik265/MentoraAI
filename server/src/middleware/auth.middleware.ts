import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.ts';
import { User, IUser } from '../models/User.ts';
import { StudentProfile, IStudentProfile } from '../models/StudentProfile.ts';
import { errorResponse } from '../utils/response.ts';

export interface AuthRequest extends Request {
  user?: IUser;
  studentProfile?: IStudentProfile;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(errorResponse('UNAUTHORIZED', 'Authentication token missing or invalid'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtAccessSecret) as { userId: string; role: string };

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json(errorResponse('UNAUTHORIZED', 'User not found or token expired'));
    }

    req.user = user;

    if (user.role === 'student') {
      const profile = await StudentProfile.findOne({ userId: user._id });
      if (profile) {
        req.studentProfile = profile;
      }
    }

    next();
  } catch (err: any) {
    return res.status(401).json(errorResponse('UNAUTHORIZED', 'Invalid or expired token', err?.message));
  }
}

export async function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtAccessSecret) as { userId: string; role: string };
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
        const profile = await StudentProfile.findOne({ userId: user._id });
        if (profile) req.studentProfile = profile;
      }
    }
  } catch {
    // Ignore invalid tokens in optionalAuth
  }
  next();
}
