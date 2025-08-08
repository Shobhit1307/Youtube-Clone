// backend/routes/subscriptionRoutes.js
import express from 'express';
import { toggleSubscription, getSubscribedChannels } from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// toggle subscribe/unsubscribe
router.post('/:channelId', protect, toggleSubscription);

// get channels current user subscribed to
router.get('/', protect, getSubscribedChannels);

export default router;
