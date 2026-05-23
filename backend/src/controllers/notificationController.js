import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getUnreadCount } from '../services/notificationService.js';

/**
 * GET /api/notifications
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('fromUser', 'name username avatar');

  const unreadCount = await getUnreadCount(req.user._id);

  res.json({
    success: true,
    data: { notifications, unreadCount },
  });
});

/**
 * GET /api/notifications/unread-count
 */
export const getUnreadCountHandler = asyncHandler(async (req, res) => {
  const unreadCount = await getUnreadCount(req.user._id);
  res.json({ success: true, data: { unreadCount } });
});

/**
 * PUT /api/notifications/read-all
 */
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { read: true }
  );
  res.json({ success: true, data: { unreadCount: 0 } });
});

/**
 * PUT /api/notifications/:id/read
 */
export const markOneRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.read = true;
  await notification.save();

  const unreadCount = await getUnreadCount(req.user._id);
  res.json({ success: true, data: { notification, unreadCount } });
});
