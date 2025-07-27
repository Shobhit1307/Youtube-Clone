import Channel from '../models/Channel.js';
import Video from '../models/Video.js';

export const createChannel = async (req, res) => {
  const { channelName, description, channelBanner } = req.body;
  const channel = await Channel.create({
    channelName, description, channelBanner,
    owner: req.user._id
  });
  res.status(201).json(channel);
};

export const getChannelById = async (req, res) => {
  const channel = await Channel.findById(req.params.id)
    .populate('owner', 'username')
    .populate('videos');
  if (!channel) return res.status(404).json({ message: 'Channel not found' });
  res.json(channel);
};
