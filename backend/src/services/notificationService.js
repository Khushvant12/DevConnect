import Notification from '../models/Notification.js';
import { getUserRoom } from '../utils/chatHelpers.js';

let ioInstance = null;

export const setSocketIO = (io) => {
  ioInstance = io;
};

/**
 * Create notification and push via Socket.IO if user is connected.
 */
export const createNotification = async ({
  userId,
  type,
  title,
  body = '',
  link = '',
  fromUser = null,
  project = null,
  teamRequest = null,
}) => {
  if (!userId) return null;

  const notification = await Notification.create({
    user: userId,
    type,
    title,
    body,
    link,
    fromUser,
    project,
    teamRequest,
  });

  await notification.populate('fromUser', 'name username avatar');

  if (ioInstance) {
    ioInstance.to(getUserRoom(userId)).emit('new_notification', {
      notification,
      unreadCount: await Notification.countDocuments({ user: userId, read: false }),
    });
  }

  return notification;
};

export const getUnreadCount = (userId) =>
  Notification.countDocuments({ user: userId, read: false });
