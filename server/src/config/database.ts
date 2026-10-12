import mongoose from 'mongoose';
import { config } from './env.ts';
import { logger } from './logger.ts';

let dbReadyPromise: Promise<typeof mongoose> | null = null;

export async function connectDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (dbReadyPromise) {
    return dbReadyPromise;
  }

  dbReadyPromise = (async () => {
    // Only attempt external URI if explicitly specified by user (not localhost default)
    if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('localhost:27017')) {
      try {
        const mongoUri = process.env.MONGODB_URI;
        logger.info(`Attempting MongoDB connection to configured MONGODB_URI...`);
        mongoose.set('strictQuery', true);
        await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 3000,
          connectTimeoutMS: 5000,
        });
        logger.info('MongoDB successfully connected.');
        return mongoose;
      } catch (err: any) {
        logger.warn(`Configured MONGODB_URI unreachable (${err?.message}). Falling back to in-memory Mongo server...`);
      }
    }

    // Fast isolated in-memory MongoDB for instant zero-dependency execution
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      logger.info(`Started in-memory MongoDB at ${inMemoryUri}`);

      await mongoose.connect(inMemoryUri);
      logger.info('Connected to in-memory MongoDB successfully.');
      return mongoose;
    } catch (fallbackErr: any) {
      logger.error('Failed to initialize in-memory MongoDB instance:', fallbackErr?.message);
      throw fallbackErr;
    }
  })();

  return dbReadyPromise;
}

export function getDatabaseStatus(): { status: string; readyState: number; host?: string; name?: string } {
  const readyState = mongoose.connection.readyState;
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return {
    status: states[readyState] || 'unknown',
    readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
  };
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected cleanly.');
  } catch (err: any) {
    logger.error('Error during database disconnect:', err?.message);
  }
}
