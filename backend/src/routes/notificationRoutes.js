import express from 'express';
import {
  getNotifications,
  getUnreadCountHandler,
  markAllRead,
  markOneRead,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCountHandler);
router.put('/read-all', protect, markAllRead);
router.put('/:id/read', protect, markOneRead);

export default router;
