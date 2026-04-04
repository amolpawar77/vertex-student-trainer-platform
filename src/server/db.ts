import mongoose from 'mongoose';
import { MONGODB_URI } from './config';

export async function connectDatabase(): Promise<void> {
  if (!MONGODB_URI) {
    throw new Error('Missing MONGODB_URI in environment');
  }

  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });

  console.log('✅ MongoDB connected');
}

export function disconnectDatabase(): Promise<void> {
  return mongoose.disconnect();
}
