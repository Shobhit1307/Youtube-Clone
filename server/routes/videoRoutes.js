// backend/routes/videoRoutes.js
import express from 'express';
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  getTrending
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getVideos);
router.get('/:id', getVideoById);
router.post('/', protect, createVideo);
router.put('/:id', protect, updateVideo);
router.delete('/:id', protect, deleteVideo);
router.get('/trending', getTrending);


router.post('/:id/like', protect, likeVideo);
router.post('/:id/dislike', protect, dislikeVideo);

export default router;
