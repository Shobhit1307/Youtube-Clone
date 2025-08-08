// backend/controllers/videoController.js
import mongoose from 'mongoose';
import Video from '../models/Video.js';
import Channel from '../models/Channel.js';

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

export async function getVideos(req, res) {
  const { search = '', category = '' } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
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
    videoUrl: v.videoUrl?.startsWith('http') ? v.videoUrl : `${SERVER_URL}${v.videoUrl}`,
    thumbnailUrl: v.thumbnailUrl?.startsWith('http') ? v.thumbnailUrl : `${SERVER_URL}${v.thumbnailUrl}`,
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

export async function getVideoById(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid video id' });
  }

  const video = await Video.findById(req.params.id)
    .populate('uploader', 'username avatar')
    .populate({
      path: 'channel',
      select: 'channelName channelBanner subscribers',
      populate: { path: 'owner', select: 'username avatar' }
    });

  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }

  // increment views
  video.views = (video.views || 0) + 1;
  await video.save();

  res.json({
    _id: video._id,
    title: video.title,
    description: video.description,
    videoUrl: video.videoUrl?.startsWith('http') ? video.videoUrl : `${process.env.SERVER_URL || 'http://localhost:5000'}${video.videoUrl}`,
    thumbnailUrl: video.thumbnailUrl?.startsWith('http') ? video.thumbnailUrl : `${process.env.SERVER_URL || 'http://localhost:5000'}${video.thumbnailUrl}`,
    category: video.category,
    views: video.views,
    uploadDate: video.uploadDate,
    uploader: video.uploader,
    channel: video.channel,
    likes: video.likes.length,
    dislikes: video.dislikes.length
  });
}


export async function createVideo(req, res) {
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

  const channel = await Channel.findById(channelId);
  if (!channel) {
    return res.status(404).json({ message: 'Channel not found' });
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

  // push into channel.videos for immediate population on channel fetch
  try {
    channel.videos.push(video._id);
    await channel.save();
  } catch (err) {
    console.error('Failed to add video id to channel.videos', err);
  }

  res.status(201).json(video);
}

export async function updateVideo(req, res) {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });

  // ensure only uploader can update
  if (video.uploader.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // only allow selected fields
  const allowed = ['title', 'description', 'category', 'thumbnailUrl'];
  allowed.forEach(f => {
    if (f in req.body) video[f] = req.body[f];
  });

  await video.save();
  res.json(video);
}

export async function deleteVideo(req, res) {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });

  // only uploader can delete
  if (video.uploader.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // remove reference from channel.videos if present
  try {
    if (video.channel) {
      await Channel.findByIdAndUpdate(video.channel, { $pull: { videos: video._id } });
    }
  } catch (err) {
    console.error('Error removing video from channel.videos', err);
  }

  await video.deleteOne();
  res.json({ message: 'Video deleted', id: req.params.id });
}

export async function likeVideo(req, res) {
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

export async function dislikeVideo(req, res) {
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

export async function getTrending(req, res) {
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
