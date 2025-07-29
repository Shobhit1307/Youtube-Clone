import Comment from '../models/Comment.js';

// Add comment
export const addComment = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }
  const comment = await Comment.create({
    video: req.params.videoId,
    user: req.user._id,
    text,
  });
  await comment.populate('user', 'username avatar');
  res.status(201).json(comment);
};

// Get all comments for a video
export const getCommentsByVideo = async (req, res) => {
  const comments = await Comment.find({ video: req.params.videoId })
    .populate('user', 'username avatar')
    .sort({ timestamp: -1 });
  res.json(comments);
};

// Update comment (only by owner)
export const updateComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to edit' });
  }
  if (!req.body.text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }
  comment.text = req.body.text;
  await comment.save();
  await comment.populate('user', 'username avatar');
  res.json(comment);
};

// Delete comment (only by owner)
export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete' });
  }
  await comment.deleteOne();
  res.json({ message: 'Comment deleted', id: req.params.id });
};
