import Comment from '../models/Comment.js';

export const addComment = async (req, res) => {
  const { text } = req.body;
  const comment = await Comment.create({
    video: req.params.videoId,
    user: req.user._id,
    text
  });
  res.status(201).json(comment);
};

export const getCommentsByVideo = async (req, res) => {
  const comments = await Comment.find({ video: req.params.videoId })
    .populate('user', 'username avatar')
    .sort({ timestamp: -1 });
  res.json(comments);
};

export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment || comment.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });
  await comment.remove();
  res.json({ message: 'Comment deleted' });
};
