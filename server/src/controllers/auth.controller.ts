import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.ts';
import { successResponse, errorResponse } from '../utils/response.ts';
import { AuthRequest } from '../middleware/auth.middleware.ts';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, role, fullName, state, classGrade } = req.body;
      const result = await authService.register({
        email,
        password,
        role,
        fullName,
        state,
        classGrade,
      });
      res.status(201).json(successResponse(result, 'Registration successful'));
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json(errorResponse('AUTH_ERROR', err.message));
      }
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      res.json(successResponse(result, 'Login successful'));
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json(errorResponse('AUTH_ERROR', err.message));
      }
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);
      res.json(successResponse(tokens, 'Tokens refreshed successfully'));
    } catch (err: any) {
      if (err.statusCode) {
        return res.status(err.statusCode).json(errorResponse('REFRESH_ERROR', err.message));
      }
      next(err);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await authService.logout(String(req.user._id));
      }
      res.json(successResponse({ loggedOut: true }, 'Logout successful'));
    } catch (err) {
      next(err);
    }
  }

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.json(
        successResponse({
          user: {
            id: req.user?._id,
            email: req.user?.email,
            role: req.user?.role,
            isVerified: req.user?.isVerified,
            lastLogin: req.user?.lastLogin,
          },
          profile: req.studentProfile,
        })
      );
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
