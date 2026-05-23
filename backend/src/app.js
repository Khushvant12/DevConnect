import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { configureCloudinary } from './config/cloudinary.js';

dotenv.config();
configureCloudinary();

const app = express();

// CORS — allow Vite dev server and production frontend URL
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DevConnect API is running",
  });
});
app.use(express.urlencoded({ extended: true }));

// REST API under /api
app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
