import mongoose, { Mongoose } from 'mongoose';
import { env } from './env';
import logger from './logger';

/**
 * Global is used here to maintain a cached connection across hot starts
 * in serverless environments like Vercel.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async (): Promise<Mongoose> => {
  if (cached.conn) {
    logger.debug('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    };

    logger.info('Creating new MongoDB connection...');
    cached.promise = mongoose.connect(env.MONGODB_URI, opts).then((mongoose) => {
      logger.info(`MongoDB Connected: ${mongoose.connection.host}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    logger.error(`MongoDB Connection Error: ${(e as Error).message}`);
    
    // In local dev, exit so we notice. In production/serverless, 
    // let it fail per request to allow the function to keep trying or return 500.
    if (env.NODE_ENV === 'development') {
      process.exit(1);
    }
    throw e;
  }

  return cached.conn;
};
