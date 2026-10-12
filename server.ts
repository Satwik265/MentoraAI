import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { createApp } from './server/src/app.ts';
import { connectDatabase } from './server/src/config/database.ts';
import { seedDatabase } from './server/seeds/seed.ts';
import { logger } from './server/src/config/logger.ts';

dotenv.config();

// Parse port from environment or CLI arguments (--port 3000)
const args = process.argv.slice(2);
let port = Number(process.env.PORT) || 3000;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port' && args[i + 1]) {
    port = Number(args[i + 1]);
  }
}

async function bootstrap() {
  try {
    const app = createApp();

    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      logger.info('Vite development middlewares attached.');
    } else {
      const distPath = path.resolve(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
      logger.info(`Serving production static assets from ${distPath}`);
    }

    // Start listening immediately on port 3000 to ensure fast dev server boot
    app.listen(port, '0.0.0.0', () => {
      logger.info(`[MentoraAI Server] Service online at http://0.0.0.0:${port}`);
    });

    // Initialize database connection and seed in background
    connectDatabase()
      .then(async () => {
        logger.info('Verifying seed data status...');
        await seedDatabase();
        logger.info('Database initialized and ready.');
      })
      .catch(err => {
        logger.error('Database initialization warning:', err?.message || err);
      });

  } catch (err: any) {
    logger.error('Failed to start MentoraAI service:', err?.message || err);
    process.exit(1);
  }
}

bootstrap();
