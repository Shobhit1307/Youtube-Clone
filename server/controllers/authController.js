// backend/controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Video from '../models/Video.js';
import Comment from '../models/Comment.js';

const generateToken = userId =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

export const registerUser = async (req, res) => {
  const { username, email, password, avatar } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email is already registered' });
  }

  try {
    // Optional: Validate avatar URL if provided
    if (avatar) {
      try {
        new URL(avatar); // Basic URL validation
      } catch {
        return res.status(400).json({ message: 'Invalid avatar URL' });
      }
    }

    const user = await User.create({
      username,
      email,
      password,
      avatar: avatar || '', // Save avatar or empty string
    });

    res.status(201).json({
      id: user._id,
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const authUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'No account found with this email' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  res.json({
    id: user._id,
    _id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    token: generateToken(user._id),
  });
};

export const updateProfile = async (req, res) => {
  const { username, avatar } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (username) user.username = username;
  if (avatar) user.avatar = avatar;
  await user.save();
  res.json({ username: user.username, avatar: user.avatar });
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('-password');

    // liked videos
    const likedVideos = await Video.find({ likes: userId })
      .populate('uploader', 'username')
      .populate('channel', 'channelName');

    // commented videos (unique)
    const comments = await Comment.find({ user: userId }).populate({
      path: 'video',
      populate: [{ path: 'uploader', select: 'username' }, { path: 'channel', select: 'channelName' }]
    });

    // collect unique videos from comments
    const commentedMap = new Map();
    comments.forEach(c => {
      if (c.video) commentedMap.set(String(c.video._id), c.video);
    });
    const commentedVideos = Array.from(commentedMap.values());

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      likedVideos: likedVideos.map(v => ({
        _id: v._id,
        title: v.title,
        thumbnailUrl: v.thumbnailUrl,
        uploader: v.uploader,
        channel: v.channel,
        views: v.views,
      })),
      commentedVideos: commentedVideos.map(v => ({
        _id: v._id,
        title: v.title,
        thumbnailUrl: v.thumbnailUrl,
        uploader: v.uploader,
        channel: v.channel,
        views: v.views,
      }))
    });
  } catch (err) {
    console.error('getProfile error', err);
    res.status(500).json({ message: 'Server error' });
  }
};