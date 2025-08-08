import mongoose from 'mongoose';
import Channel from '../models/Channel.js';

/**
 * POST   /api/channels/
 * Create a new channel for logged-in user.
 * One channel per user. Returns 400 with existing channelId if already present.
 */
export async function createChannel(req, res) {
  const ownerId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const existing = await Channel.findOne({ owner: ownerId });
    if (existing) {
      return res.status(400).json({
        message: 'Channel already exists',
        channelId: existing._id
      });
    }

    const { channelName, description, channelBanner } = req.body;
    const channel = await Channel.create({
      channelName,
      description,
      channelBanner,
      owner: ownerId
    });

    return res.status(201).json(channel);
  } catch (err) {
    console.error('Error creating channel', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * GET    /api/channels/my
 * Get the channel owned by the logged-in user.
 * Protected route.
 */
export async function getMyChannel(req, res) {
  const ownerId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const channel = await Channel.findOne({ owner: ownerId })
      .populate('owner', 'username avatar')
      .populate({
        path: 'videos',
        populate: { path: 'uploader', select: 'username avatar' },
        options: { sort: { uploadDate: -1 } }
      })
      .populate('subscribers', 'username avatar');

    if (!channel) {
      return res.status(404).json({ message: 'No channel found for this user' });
    }

    // include subscribersCount for convenience
    const channelObj = channel.toObject();
    channelObj.subscribersCount = (channel.subscribers || []).length;

    return res.json(channelObj);
  } catch (err) {
    console.error('Error fetching channel by owner', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getChannelById(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid channel ID' });
  }

  try {
    const channel = await Channel.findById(id)
      .populate('owner', 'username avatar')
      .populate({
        path: 'videos',
        populate: { path: 'uploader', select: 'username avatar' },
        options: { sort: { uploadDate: -1 } }
      })
      .populate('subscribers', 'username avatar');

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const channelObj = channel.toObject();
    channelObj.subscribersCount = (channel.subscribers || []).length;

    return res.json(channelObj);
  } catch (err) {
    console.error('Error fetching channel by ID', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
