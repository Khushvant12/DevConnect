import express from 'express';
import { body } from 'express-validator';
import {
  getMyProfile,
  updateProfile,
  uploadProfileAvatar,
  getAllProfiles,
  getProfileById,
} from '../controllers/profileController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { uploadAvatar } from '../middleware/uploadMiddleware.js';
import { EXPERIENCE_LEVELS } from '../models/User.js';

const router = express.Router();

const updateValidation = [
  body('name').optional().trim().isLength({ min: 1, max: 80 }).withMessage('Name is invalid'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio max 500 characters'),
  body('education').optional().isLength({ max: 200 }),
  body('company').optional().isLength({ max: 120 }),
  body('location').optional().isLength({ max: 120 }),
  body('experienceLevel')
    .optional()
    .isIn([...EXPERIENCE_LEVELS, ''])
    .withMessage(`experienceLevel must be: ${EXPERIENCE_LEVELS.join(', ')}`),
  body('skills').optional().isArray(),
  body('techStack').optional().isArray(),
];

router.get('/me', protect, getMyProfile);
router.put('/update', protect, updateValidation, validate, updateProfile);
router.post(
  '/avatar',
  protect,
  (req, res, next) => {
    uploadAvatar.single('image')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  uploadProfileAvatar
);
router.get('/all', getAllProfiles);
router.get('/:id', optionalProtect, getProfileById);

export default router;
