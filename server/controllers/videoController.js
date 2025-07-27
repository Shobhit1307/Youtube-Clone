// backend/controllers/videoController.js
import Video from '../models/Video.js';
import mongoose from 'mongoose';

// GET /api/videos ?search=&category=
export const getVideos = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (category) filter.category = category;

    const videos = await Video.find(filter)
      .populate('uploader', 'username')
      .populate('channel', 'channelName');

    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/videos/:id
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploader', 'username')
      .populate('channel', 'channelName');
    if (!video) return res.status(404).json({ message: 'Video not found' });

    video.views++;
    await video.save();

    res.json(video);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/videos (auth required)
export const createVideo = async (req, res) => {
  const { title, description, videoUrl, thumbnailUrl, category, channelId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: 'Invalid channelId provided' });
  }

  const video = await Video.create({
    title,
    description,
    videoUrl,
    thumbnailUrl,
    category,
    uploader: req.user._id,
    channel: channelId
  });

  res.status(201).json(video);
};

// PUT /api/videos/:id (auth required, owner only)
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(video, req.body);
    const updated = await video.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// DELETE /api/videos/:id (auth required, owner only)
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await video.remove();
    res.json({ message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
};

// POST /api/videos/:id/like (auth required)
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id.toString();
    if (video.likes.includes(userId)) {
      video.likes.pull(userId);
    } else {
      video.likes.push(userId);
      video.dislikes.pull(userId);
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (err) {
    res.status(500).json({ message: 'Could not like video', error: err.message });
  }
};

// POST /api/videos/:id/dislike (auth required)
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user._id.toString();
    if (video.dislikes.includes(userId)) {
      video.dislikes.pull(userId);
    } else {
      video.dislikes.push(userId);
      video.likes.pull(userId);
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (err) {
    res.status(500).json({ message: 'Could not dislike video', error: err.message });
  }
};
