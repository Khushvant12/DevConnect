import TeamRequest from '../models/TeamRequest.js';
import Project from '../models/Project.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createNotification } from '../services/notificationService.js';

const populateOpts = [
  { path: 'sender', select: 'name username avatar' },
  { path: 'receiver', select: 'name username avatar' },
  { path: 'project', select: 'title thumbnail' },
];

/**
 * POST /api/team-requests/send
 * 
 * Prevents duplicate team requests by checking:
 * 1. Existing pending request from sender to receiver (outgoing)
 * 2. Existing pending request from receiver to sender (incoming)
 * 3. Already accepted collaboration between both users
 */
export const sendTeamRequest = asyncHandler(async (req, res) => {
  const { receiverId, message, projectId } = req.body;

  if (!receiverId || !message?.trim()) {
    res.status(400);
    throw new Error('receiverId and message are required');
  }

  if (String(receiverId) === String(req.user._id)) {
    res.status(400);
    throw new Error('Cannot send request to yourself');
  }

  // Check 1: Prevent outgoing duplicate pending requests
  // Scenario: User A already sent a pending request to User B
  const existingOutgoing = await TeamRequest.findOne({
    sender: req.user._id,
    receiver: receiverId,
    status: 'pending',
  });

  if (existingOutgoing) {
    res.status(400);
    throw new Error('You already have a pending request to this user');
  }

  // Check 2: Prevent when receiver already has a pending request to sender
  // Scenario: User B already sent a pending request to User A
  // User A cannot send another request while User B's is pending
  const existingIncoming = await TeamRequest.findOne({
    sender: receiverId,
    receiver: req.user._id,
    status: 'pending',
  });

  if (existingIncoming) {
    res.status(400);
    throw new Error('This user already has a pending request to you. Please respond to their request first');
  }

  // Check 3: Prevent duplicate requests if already collaborating
  // Scenario: User A and User B already accepted collaboration
  // Don't allow new requests between them
  const existingAccepted = await TeamRequest.findOne({
    $or: [
      { sender: req.user._id, receiver: receiverId, status: 'accepted' },
      { sender: receiverId, receiver: req.user._id, status: 'accepted' },
    ],
  });

  if (existingAccepted) {
    res.status(400);
    throw new Error('You are already collaborating with this user');
  }

  if (projectId) {
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
  }

  const request = await TeamRequest.create({
    sender: req.user._id,
    receiver: receiverId,
    message: message.trim(),
    project: projectId || null,
  });

  await request.populate(populateOpts);

  await createNotification({
    userId: receiverId,
    type: 'team_request',
    title: `${req.user.name} sent a team-up request`,
    body: message.trim().slice(0, 100),
    link: '/team-requests',
    fromUser: req.user._id,
    teamRequest: request._id,
  });

  res.status(201).json({ success: true, data: { request } });
});

/**
 * GET /api/team-requests/status/:userId
 * Check the request status between current user and another user
 * Returns: null (no request), 'pending_outgoing', 'pending_incoming', 'accepted'
 */
export const getRequestStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Check if current user sent a pending request to this user
  const outgoingPending = await TeamRequest.findOne({
    sender: req.user._id,
    receiver: userId,
    status: 'pending',
  });

  if (outgoingPending) {
    return res.json({ 
      success: true, 
      data: { status: 'pending_outgoing' } 
    });
  }

  // Check if this user sent a pending request to current user
  const incomingPending = await TeamRequest.findOne({
    sender: userId,
    receiver: req.user._id,
    status: 'pending',
  });

  if (incomingPending) {
    return res.json({ 
      success: true, 
      data: { status: 'pending_incoming' } 
    });
  }

  // Check if they already collaborated (accepted)
  const accepted = await TeamRequest.findOne({
    $or: [
      { sender: req.user._id, receiver: userId, status: 'accepted' },
      { sender: userId, receiver: req.user._id, status: 'accepted' },
    ],
  });

  if (accepted) {
    return res.json({ 
      success: true, 
      data: { status: 'accepted' } 
    });
  }

  // No request exists
  res.json({ 
    success: true, 
    data: { status: null } 
  });
});

/**
 * GET /api/team-requests/incoming
 */
export const getIncomingRequests = asyncHandler(async (req, res) => {
  const requests = await TeamRequest.find({ receiver: req.user._id })
    .sort({ createdAt: -1 })
    .populate(populateOpts);

  res.json({ success: true, data: { requests } });
});

/**
 * GET /api/team-requests/outgoing
 */
export const getOutgoingRequests = asyncHandler(async (req, res) => {
  const requests = await TeamRequest.find({ sender: req.user._id })
    .sort({ createdAt: -1 })
    .populate(populateOpts);

  res.json({ success: true, data: { requests } });
});

/**
 * PUT /api/team-requests/:id/accept
 */
export const acceptTeamRequest = asyncHandler(async (req, res) => {
  const request = await TeamRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  if (String(request.receiver) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (request.status !== 'pending') {
    res.status(400);
    throw new Error('Request is no longer pending');
  }

  request.status = 'accepted';
  await request.save();
  await request.populate(populateOpts);

  await createNotification({
    userId: request.sender,
    type: 'team_request_accepted',
    title: `${req.user.name} accepted your team-up request`,
    body: 'You can start chatting now!',
    link: `/chat?user=${req.user._id}`,
    fromUser: req.user._id,
    teamRequest: request._id,
  });

  res.json({ success: true, data: { request } });
});

/**
 * PUT /api/team-requests/:id/reject
 */
export const rejectTeamRequest = asyncHandler(async (req, res) => {
  const request = await TeamRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  if (String(request.receiver) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (request.status !== 'pending') {
    res.status(400);
    throw new Error('Request is no longer pending');
  }

  request.status = 'rejected';
  await request.save();
  await request.populate(populateOpts);

  await createNotification({
    userId: request.sender,
    type: 'team_request_rejected',
    title: `${req.user.name} declined your team-up request`,
    link: '/team-requests',
    fromUser: req.user._id,
    teamRequest: request._id,
  });

  res.json({ success: true, data: { request } });
});

/**
 * DELETE /api/team-requests/:id/cancel
 */
export const cancelTeamRequest = asyncHandler(async (req, res) => {
  const request = await TeamRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  if (String(request.sender) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (request.status !== 'pending') {
    res.status(400);
    throw new Error('Only pending requests can be cancelled');
  }

  request.status = 'cancelled';
  await request.save();

  res.json({ success: true, data: { request } });
});
