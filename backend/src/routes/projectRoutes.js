import express from 'express';
import { body } from 'express-validator';
import {
  createProject,
  getAllProjects,
  getSavedProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleLikeProject,
  toggleSaveProject,
  addProjectComment,
  getProjectComments,
  updateProjectComment,
  deleteProjectComment,
} from '../controllers/projectController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { uploadAvatar } from '../middleware/uploadMiddleware.js';

import { PROJECT_CATEGORIES, DIFFICULTY_LEVELS } from '../models/Project.js';

const router = express.Router();

const commentValidation = [
  body('text').trim().notEmpty().withMessage('Comment text is required').isLength({ max: 1000 }),
];

const projectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 120 })
    .withMessage('Title cannot exceed 120 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 3000 })
    .withMessage('Description cannot exceed 3000 characters'),
  body('category')
    .optional()
    .isIn(PROJECT_CATEGORIES)
    .withMessage(`Category must be: ${PROJECT_CATEGORIES.join(', ')}`),
  body('difficulty')
    .optional()
    .isIn(DIFFICULTY_LEVELS)
    .withMessage(`Difficulty must be: ${DIFFICULTY_LEVELS.join(', ')}`),
  body('teamSize')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Team size must be between 1 and 50'),
];

const handleUpload = (req, res, next) => {
  uploadAvatar.single('thumbnail')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

router.post('/create', protect, handleUpload, projectValidation, validate, createProject);
router.get('/all', optionalProtect, getAllProjects);
router.get('/saved', protect, getSavedProjects);

router.put('/comments/:commentId', protect, commentValidation, validate, updateProjectComment);
router.delete('/comments/:commentId', protect, deleteProjectComment);

router.get('/:id/comments', getProjectComments);
router.get('/:id', optionalProtect, getProjectById);
router.put('/update/:id', protect, handleUpload, projectValidation, validate, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/like/:id', protect, toggleLikeProject);
router.post('/save/:id', protect, toggleSaveProject);
router.post('/comment/:id', protect, commentValidation, validate, addProjectComment);

export default router;
