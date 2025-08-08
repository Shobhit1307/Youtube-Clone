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
import { uploadVideo } from '../middleware/upload.js';
import Video from '../models/Video.js';

const router = express.Router();

// Static routes must come before dynamic :id route

// Route to get all unique video categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Video.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Trending videos
router.get('/trending', getTrending);

// List videos with optional filters
router.get('/', getVideos);

// Get video by id (dynamic route)
router.get('/:id', getVideoById);

// Create a new video (protected)
router.post('/', protect, uploadVideo, createVideo);

// Update a video (protected)
router.put('/:id', protect, updateVideo);

// Delete a video (protected)
router.delete('/:id', protect, deleteVideo);

// Like a video (protected)
router.post('/:id/like', protect, likeVideo);

// Dislike a video (protected)
router.post('/:id/dislike', protect, dislikeVideo);

export default router;
