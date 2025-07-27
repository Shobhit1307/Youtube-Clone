import express from 'express';
import { addComment, getCommentsByVideo, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/:videoId', protect, addComment);
router.get('/:videoId', getCommentsByVideo);
router.delete('/:id', protect, deleteComment);

export default router;
