// backend/routes/commentRoutes.js
import express from 'express';
import { addComment, getCommentsByVideo, deleteComment, updateComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', getCommentsByVideo);
router.post('/', protect, addComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

export default router;
