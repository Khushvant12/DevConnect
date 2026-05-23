import express from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import projectRoutes from './projectRoutes.js';
import messageRoutes from './messageRoutes.js';
import teamRequestRoutes from './teamRequestRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'DevConnect API is running' });
});

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/projects', projectRoutes);
router.use('/messages', messageRoutes);
router.use('/team-requests', teamRequestRoutes);
router.use('/notifications', notificationRoutes);

export default router;
