import express from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import projectRoutes from './projectRoutes.js';
import messageRoutes from './messageRoutes.js';
import teamRequestRoutes from './teamRequestRoutes.js';
import notificationRoutes from './notificationRoutes.js';

import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 50, // 50 attempts per 15 minutes
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
});

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'DevConnect API is running' });
});

router.use('/auth', authLimiter, authRoutes);
router.use('/profile', profileRoutes);
router.use('/projects', projectRoutes);
router.use('/messages', messageRoutes);
router.use('/team-requests', teamRequestRoutes);
router.use('/notifications', notificationRoutes);

export default router;
