// routes/search.js
import express from 'express';
import Video from '../models/Video.js';
import Channel from '../models/Channel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === '') return res.json({ videos: [], channels: [] });

  try {
    const videos = await Video.find({
      title: { $regex: q, $options: 'i' },
    }).limit(10);

    const channels = await Channel.find({
      channelName: { $regex: q, $options: 'i' },
    }).limit(10);

    res.json({ videos, channels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
