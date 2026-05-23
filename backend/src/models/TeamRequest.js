import mongoose from 'mongoose';

export const TEAM_REQUEST_STATUS = ['pending', 'accepted', 'rejected', 'cancelled'];

const teamRequestSchema = new mongoose.Schema(
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
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    status: {
      type: String,
      enum: TEAM_REQUEST_STATUS,
      default: 'pending',
    },
  },
  { timestamps: true }
);

teamRequestSchema.index({ receiver: 1, status: 1 });
teamRequestSchema.index({ sender: 1, status: 1 });

const TeamRequest = mongoose.model('TeamRequest', teamRequestSchema);
export default TeamRequest;
