import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../models/User.ts';
import { StudentProfile } from '../models/StudentProfile.ts';
import { config } from '../config/env.ts';
import { AuditLog } from '../models/AuditLog.ts';

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    role?: UserRole;
    fullName?: string;
    state?: string;
    classGrade?: string;
  }) {
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw { statusCode: 409, message: 'An account with this email address already exists' };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user: IUser = await User.create({
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role || 'student',
      isVerified: true,
      lastLogin: new Date(),
    });

    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.create({
        userId: user._id,
        fullName: data.fullName || 'Student Scholar',
        state: data.state || 'Jammu & Kashmir',
        classGrade: data.classGrade || 'Class 10 Student',
        category: 'GEN',
        annualFamilyIncome: 350000,
        ruralOrUrban: 'Rural',
      });
    }

    const tokens = this.generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    await AuditLog.create({
      userId: user._id,
      action: 'USER_REGISTER',
      entityType: 'User',
      entityId: String(user._id),
      metadata: { role: user.role, email: user.email },
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      profile,
      tokens,
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await User.findOne({ email: data.email.toLowerCase() });
    if (!user) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    const tokens = this.generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    user.lastLogin = new Date();
    await user.save();

    const profile = await StudentProfile.findOne({ userId: user._id });

    await AuditLog.create({
      userId: user._id,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: String(user._id),
      metadata: { email: user.email },
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      profile,
      tokens,
    };
  }

  async refreshToken(token: string) {
    if (!token) {
      throw { statusCode: 401, message: 'Refresh token required' };
    }

    try {
      const decoded = jwt.verify(token, config.jwtRefreshSecret) as { userId: string };
      const user = await User.findById(decoded.userId);

      if (!user || user.refreshToken !== token) {
        throw { statusCode: 401, message: 'Invalid or revoked refresh token' };
      }

      const tokens = this.generateTokens(user);
      user.refreshToken = tokens.refreshToken;
      await user.save();

      return tokens;
    } catch (err: any) {
      throw { statusCode: 401, message: 'Refresh token expired or invalid' };
    }
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
    return true;
  }

  private generateTokens(user: IUser) {
    const payload = { userId: user._id, role: user.role };

    const accessToken = jwt.sign(payload, config.jwtAccessSecret as string, {
      expiresIn: config.jwtAccessExpiresIn,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign({ userId: user._id }, config.jwtRefreshSecret as string, {
      expiresIn: config.jwtRefreshExpiresIn,
    } as jwt.SignOptions);

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  }
}

export const authService = new AuthService();
