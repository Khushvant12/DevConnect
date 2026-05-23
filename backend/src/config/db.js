import mongoose from 'mongoose';

/**
 * Connect to MongoDB using Mongoose.
 * Exits process on failure so misconfiguration is obvious in dev/deploy.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};
