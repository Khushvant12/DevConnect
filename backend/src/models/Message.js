import mongoose from 'mongoose';
import { getConversationId } from '../utils/chatHelpers.js';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    conversationId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

messageSchema.pre('save', function (next) {
  if (!this.conversationId) {
    this.conversationId = getConversationId(this.sender, this.receiver);
  }
  next();
});

messageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
