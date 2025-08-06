import express from 'express';
import {
  createChannel,
  getMyChannel,
  getChannelById
} from '../controllers/channelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only authenticated users can create
router.post('/', protect, createChannel);

// Get the channel of the currently logged-in user
router.get('/my', protect, getMyChannel);

// Publicly accessible channel by ID
router.get('/:id', getChannelById);

export default router;
