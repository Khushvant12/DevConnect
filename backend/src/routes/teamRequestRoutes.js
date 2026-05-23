import express from 'express';
import {
  sendTeamRequest,
  getIncomingRequests,
  getOutgoingRequests,
  getRequestStatus,
  acceptTeamRequest,
  rejectTeamRequest,
  cancelTeamRequest,
} from '../controllers/teamRequestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send', protect, sendTeamRequest);
router.get('/incoming', protect, getIncomingRequests);
router.get('/outgoing', protect, getOutgoingRequests);
router.get('/status/:userId', protect, getRequestStatus);
router.put('/:id/accept', protect, acceptTeamRequest);
router.put('/:id/reject', protect, rejectTeamRequest);
router.delete('/:id/cancel', protect, cancelTeamRequest);

export default router;
