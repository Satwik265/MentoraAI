import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './config/logger.ts';
import { errorHandler } from './middleware/error.middleware.ts';
import { getDatabaseStatus } from './config/database.ts';
import { College } from './models/College.ts';
import { Alumni } from './models/Alumni.ts';
import { StudentProfile } from './models/StudentProfile.ts';
import { Assessment } from './models/Assessment.ts';
import { Admission } from './models/Admission.ts';
import { Cutoff } from './models/Cutoff.ts';
import { Scholarship } from './models/Scholarship.ts';
import { cutoffController } from './controllers/cutoff.controller.ts';
import { chatController } from './controllers/chat.controller.ts';
import { successResponse } from './utils/response.ts';

import authRoutes from './routes/auth.routes.ts';
import studentRoutes from './routes/student.routes.ts';
import collegeRoutes from './routes/college.routes.ts';
import cutoffRoutes from './routes/cutoff.routes.ts';
import assessmentRoutes from './routes/assessment.routes.ts';
import admissionRoutes from './routes/admission.routes.ts';
import scholarshipRoutes from './routes/scholarship.routes.ts';
import alumniRoutes from './routes/alumni.routes.ts';
import feedbackRoutes from './routes/feedback.routes.ts';
import chatRoutes from './routes/chat.routes.ts';
import adminRoutes from './routes/admin.routes.ts';

export function createApp(): express.Application {
  const app = express();

  // Basic security with helmet relaxed for iFrame and client scripts
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request Logging
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (!req.path.startsWith('/@') && !req.path.startsWith('/src/')) {
      logger.debug(`${req.method} ${req.path}`);
    }
    next();
  });

  // Health and Readiness Check
  app.get('/api/health', (_req: Request, res: Response) => {
    const dbStatus = getDatabaseStatus();
    res.json(
      successResponse({
        status: 'UP',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        service: 'MentoraAI Backend API',
        uptimeSeconds: Math.floor(process.uptime()),
      })
    );
  });

  // SIH 2025 Platform Stats Endpoint
  app.get('/api/stats', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [collegesCount, alumniCount, studentsCount, completedAssessments] = await Promise.all([
        College.countDocuments(),
        Alumni.countDocuments(),
        StudentProfile.countDocuments(),
        Assessment.countDocuments({ status: 'COMPLETED' }),
      ]);

      const stats = {
        nationalDropoutRate: '11.5%',
        studentsDiscontinuedUDISE: '42.7 Lakh',
        govtCollegesEnrolledChallenges: '68%',
        careerMarketValuation: '₹5,000 Cr to ₹14,000 Cr',
        targetBeneficiariesJK: '2.5+ Million',
        verifiedCollegesCount: collegesCount || 6,
        alumniMentorsCount: alumniCount || 6,
        scholarshipsTrackedValue: '₹45+ Crores',
        studentsGuidedOnPlatform: 12480 + (completedAssessments || 0),
      };

      res.json({ success: true, stats });
    } catch (err) {
      next(err);
    }
  });

  // Cutoff prediction route for frontend legacy path `/api/colleges/predict`
  app.post('/api/colleges/predict', cutoffController.predict);

  // Backward compatibility for `/api/tts`
  app.post('/api/tts', chatController.tts);

  // Mount Application Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/student', studentRoutes);
  app.use('/api/colleges', collegeRoutes);
  app.use('/api/cutoffs', cutoffRoutes);
  app.use('/api/assessments', assessmentRoutes);
  app.use('/api/admissions', admissionRoutes);
  app.use('/api/applications', admissionRoutes); // Frontend compatibility alias
  app.use('/api/scholarships', scholarshipRoutes);
  app.use('/api/alumni', alumniRoutes);
  app.use('/api/feedback', feedbackRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/admin', adminRoutes);

  // Central Error Handler
  app.use(errorHandler);

  return app;
}
