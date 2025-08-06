// backend/controllers/videoController.js
import mongoose from 'mongoose';
import Video from '../models/Video.js';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

function normalizeYouTubeURL(raw = '') {
  try {
    const u = new URL(raw.trim());
    const v = u.searchParams.get('v');
    return v ? `https://www.youtube.com/watch?v=${v}` : raw.trim();
  } catch {
    return raw.trim();
  }
}

async function getVideos(req, res) {
  const { search = '', category = '' } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { 'uploader.username': { $regex: search, $options: 'i' } }
    ];
  }

  if (category) filter.category = category;

  const videos = await Video.find(filter)
    .populate('uploader', 'username')
    .populate('channel', 'channelName');

  const sanitized = videos.map((v) => ({
    _id: v._id,
    title: v.title,
    description: v.description,
    videoUrl: v.videoUrl.startsWith('http')
      ? v.videoUrl
      : `${SERVER_URL}${v.videoUrl}`,
    thumbnailUrl: v.thumbnailUrl?.startsWith('http')
      ? v.thumbnailUrl
      : `${SERVER_URL}${v.thumbnailUrl}`,
    category: v.category,
    views: v.views,
    uploadDate: v.uploadDate,
    uploader: v.uploader,
    channel: v.channel,
    likes: v.likes.length,
    dislikes: v.dislikes.length
  }));

  res.json(sanitized);
}

async function getVideoById(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid video id' });
  }

  const video = await Video.findById(req.params.id)
    .populate('uploader', 'username')
    .populate('channel', 'channelName');

  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }

  video.views++;
  await video.save();

  res.json({
    _id: video._id,
    title: video.title,
    description: video.description,
    videoUrl: video.videoUrl.startsWith('http')
      ? video.videoUrl
      : `${SERVER_URL}${video.videoUrl}`,
    thumbnailUrl: video.thumbnailUrl?.startsWith('http')
      ? video.thumbnailUrl
      : `${SERVER_URL}${video.thumbnailUrl}`,
    category: video.category,
    views: video.views,
    uploadDate: video.uploadDate,
    uploader: video.uploader,
    channel: video.channel,
    likes: video.likes.length,
    dislikes: video.dislikes.length
  });
}

async function createVideo(req, res) {
  const { title = '', description = '', category = '', externalUrl = '' } = req.body;
  const filename = req.file?.filename;
  const channelId = req.body.channelId;

  if (!title.trim()) {
    return res.status(400).json({ message: 'Title is required' });
  }

  if ((!filename && !externalUrl) || (filename && externalUrl)) {
    return res.status(400).json({
      message: 'Provide title and choose either a video file OR a YouTube/Vimeo URL, not both.'
    });
  }

  if (!mongoose.isValidObjectId(channelId)) {
    return res.status(400).json({ message: 'Invalid channelId provided' });
  }

  const urlPart = filename ? `/uploads/videos/${filename}` : normalizeYouTubeURL(externalUrl);
  const videoUrl = urlPart.startsWith('http') ? urlPart : `${SERVER_URL}${urlPart}`;

  const thumbnailUrl = req.body.thumbnailUrl
    ? req.body.thumbnailUrl.trim()
    : req.file?.filename
    ? `${SERVER_URL}/uploads/videos/${req.file.filename}`
    : '';

  const video = await Video.create({
    title: title.trim(),
    description: description.trim(),
    category: category.trim(),
    videoUrl,
    thumbnailUrl,
    uploader: req.user._id,
    channel: channelId
  });

  res.status(201).json(video);
}

async function updateVideo(req, res) {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });
  if (video.uploader.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  Object.assign(video, req.body);
  await video.save();

  res.json(video);
}

async function deleteVideo(req, res) {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });
  if (video.uploader.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await video.deleteOne();
  res.json({ message: 'Video deleted', id: req.params.id });
}

async function likeVideo(req, res) {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });

  const uid = req.user._id.toString();
  if (video.likes.includes(uid)) {
    video.likes.pull(uid);
  } else {
    video.likes.push(uid);
    video.dislikes.pull(uid);
  }

  await video.save();
  res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
}

async function dislikeVideo(req, res) {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });

  const uid = req.user._id.toString();
  if (video.dislikes.includes(uid)) {
    video.dislikes.pull(uid);
  } else {
    video.dislikes.push(uid);
    video.likes.pull(uid);
  }

  await video.save();
  res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
}

async function getTrending(req, res) {
  const videos = await Video.find({})
    .sort({ views: -1 })
    .limit(10)
    .populate('uploader', 'username')
    .populate('channel', 'channelName');

  const sanitized = videos.map((v) => ({
    _id: v._id,
    title: v.title,
    thumbnailUrl: v.thumbnailUrl,
    views: v.views,
    uploader: v.uploader,
    channel: v.channel,
    likes: v.likes.length,
    dislikes: v.dislikes.length
  }));

  res.json(sanitized);
}

export {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  getTrending
};
