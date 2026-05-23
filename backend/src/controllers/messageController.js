import mongoose from 'mongoose';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getConversationId } from '../utils/chatHelpers.js';
import { isUserOnline } from '../socket/socketServer.js';

const userFields = 'name username avatar isOnline lastSeen';

/**
 * GET /api/messages/conversations
 */
export const getConversations = asyncHandler(async (req, res) => {
  const myId = new mongoose.Types.ObjectId(req.user._id);

  const messages = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: myId }, { receiver: myId }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$conversationId',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$receiver', myId] },
                  { $eq: ['$read', false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    { $sort: { 'lastMessage.createdAt': -1 } },
    { $limit: 50 },
  ]);

  const conversations = await Promise.all(
    messages.map(async (c) => {
      const last = c.lastMessage;
      const partnerId =
        String(last.sender) === String(myId) ? last.receiver : last.sender;
      const partner = await User.findById(partnerId).select(userFields);

      return {
        conversationId: c._id,
        partner,
        lastMessage: last,
        unreadCount: c.unreadCount,
        isOnline: isUserOnline(partnerId) || partner?.isOnline,
      };
    })
  );

  res.json({ success: true, data: { conversations } });
});

/**
 * GET /api/messages/:userId — paginated thread (newest page first)
 */
export const getMessagesWithUser = asyncHandler(async (req, res) => {
  const myId = req.user._id;
  const { userId } = req.params;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 30));
  const skip = (page - 1) * limit;

  const conversationId = getConversationId(myId, userId);

  const [messages, total] = await Promise.all([
    Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', userFields)
      .populate('receiver', userFields)
      .lean(),
    Message.countDocuments({ conversationId }),
  ]);

  res.json({
    success: true,
    data: {
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: skip + messages.length < total,
      },
    },
  });
});

/**
 * POST /api/messages/send — REST fallback for messaging
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;
  if (!receiverId || !content?.trim()) {
    res.status(400);
    throw new Error('receiverId and content are required');
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    content: content.trim(),
  });

  await message.populate('sender', userFields);
  await message.populate('receiver', userFields);

  res.status(201).json({ success: true, data: { message } });
});
