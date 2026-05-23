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

const router = express.Router();

const commentValidation = [
  body('text').trim().notEmpty().withMessage('Comment text is required').isLength({ max: 1000 }),
];

const handleUpload = (req, res, next) => {
  uploadAvatar.single('thumbnail')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

router.post('/create', protect, handleUpload, createProject);
router.get('/all', optionalProtect, getAllProjects);
router.get('/saved', protect, getSavedProjects);

router.put('/comments/:commentId', protect, commentValidation, validate, updateProjectComment);
router.delete('/comments/:commentId', protect, deleteProjectComment);

router.get('/:id/comments', getProjectComments);
router.get('/:id', optionalProtect, getProjectById);
router.put('/update/:id', protect, handleUpload, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/like/:id', protect, toggleLikeProject);
router.post('/save/:id', protect, toggleSaveProject);
router.post('/comment/:id', protect, commentValidation, validate, addProjectComment);

export default router;
