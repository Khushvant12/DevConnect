import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Message from '../models/Message.js';
import { getPrivateRoom, getUserRoom } from '../utils/chatHelpers.js';
import { createNotification, setSocketIO, getUnreadCount } from '../services/notificationService.js';
import { getAllowedOrigins } from '../config/cors.js';

/** userId -> Set of socket ids (multi-tab support) */
const onlineUsers = new Map();

const addOnline = (userId, socketId) => {
  const key = String(userId);
  if (!onlineUsers.has(key)) onlineUsers.set(key, new Set());
  onlineUsers.get(key).add(socketId);
};

const removeOnline = (userId, socketId) => {
  const key = String(userId);
  const set = onlineUsers.get(key);
  if (!set) return false;
  set.delete(socketId);
  if (set.size === 0) {
    onlineUsers.delete(key);
    return false;
  }
  return true;
};

export const isUserOnline = (userId) => onlineUsers.has(String(userId));

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: getAllowedOrigins(),
      credentials: true,
    },
  });

  setSocketIO(io);

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));

      socket.userId = String(user._id);
      socket.user = user;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    const wasOffline = !isUserOnline(userId);

    addOnline(userId, socket.id);
    socket.join(getUserRoom(userId));

    await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });

    if (wasOffline) {
      socket.broadcast.emit('user_online', { userId });
    }

    socket.emit('user_online', { userId });

    // Send current online users list to connecting client
    socket.emit('online_users', { userIds: [...onlineUsers.keys()] });

    socket.on('join_chat', ({ otherUserId }) => {
      if (!otherUserId) return;
      socket.join(getPrivateRoom(userId, otherUserId));
    });

    socket.on('leave_chat', ({ otherUserId }) => {
      if (!otherUserId) return;
      socket.leave(getPrivateRoom(userId, otherUserId));
    });

    socket.on('send_message', async ({ receiverId, content }, callback) => {
      try {
        if (!receiverId || !content?.trim()) {
          return callback?.({ success: false, message: 'Invalid message' });
        }
        if (String(receiverId) === userId) {
          return callback?.({ success: false, message: 'Cannot message yourself' });
        }

        const receiver = await User.findById(receiverId).select('_id name username');
        if (!receiver) {
          return callback?.({ success: false, message: 'Receiver not found' });
        }

        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          content: content.trim(),
        });

        await message.populate('sender', 'name username avatar');
        await message.populate('receiver', 'name username avatar');

        const payload = { message: message.toObject() };
        const room = getPrivateRoom(userId, receiverId);

        io.to(room).emit('receive_message', payload);
        io.to(getUserRoom(receiverId)).emit('receive_message', payload);

        await createNotification({
          userId: receiverId,
          type: 'message',
          title: `New message from ${socket.user.name}`,
          body: content.trim().slice(0, 80),
          link: `/chat?user=${userId}`,
          fromUser: userId,
        });

        callback?.({ success: true, message: message.toObject() });
      } catch (err) {
        callback?.({ success: false, message: err.message });
      }
    });

    socket.on('typing', ({ receiverId }) => {
      if (!receiverId) return;
      io.to(getUserRoom(receiverId)).emit('typing', { userId, from: socket.user });
    });

    socket.on('stop_typing', ({ receiverId }) => {
      if (!receiverId) return;
      io.to(getUserRoom(receiverId)).emit('stop_typing', { userId });
    });

    socket.on('message_read', async ({ otherUserId, messageIds }, callback) => {
      try {
        if (!otherUserId) return;

        const filter = {
          sender: otherUserId,
          receiver: userId,
          read: false,
        };
        if (messageIds?.length) filter._id = { $in: messageIds };

        const result = await Message.updateMany(filter, {
          read: true,
          readAt: new Date(),
        });

        io.to(getUserRoom(otherUserId)).emit('messages_read', {
          readerId: userId,
          otherUserId,
          count: result.modifiedCount,
        });

        callback?.({ success: true, count: result.modifiedCount });
      } catch (err) {
        callback?.({ success: false, message: err.message });
      }
    });

    socket.on('disconnect', async () => {
      const stillOnline = removeOnline(userId, socket.id);
      if (!stillOnline) {
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date(),
        });
        socket.broadcast.emit('user_offline', { userId });
      }
    });
  });

  console.log('Socket.IO initialized');
  return io;
};
