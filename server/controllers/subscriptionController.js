// backend/controllers/subscriptionController.js
import Channel from '../models/Channel.js';
import User from '../models/User.js';

/**
 * Toggle subscription for the logged-in user to channel/:channelId
 * POST /api/subscriptions/:channelId
 * Requires protect middleware
 */
export const toggleSubscription = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id.toString();

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const already = channel.subscribers.find(id => id.toString() === userId);

    if (already) {
      // unsubscribe
      channel.subscribers = channel.subscribers.filter(id => id.toString() !== userId);
      user.subscriptions = (user.subscriptions || []).filter(id => id.toString() !== channelId);
    } else {
      // subscribe
      channel.subscribers.push(user._id);
      user.subscriptions = user.subscriptions || [];
      if (!user.subscriptions.find(id => id.toString() === channelId)) {
        user.subscriptions.push(channel._id);
      }
    }

    await channel.save();
    await user.save();

    return res.json({
      message: already ? 'Unsubscribed' : 'Subscribed',
      subscribersCount: channel.subscribers.length,
      subscribed: !already
    });
  } catch (err) {
    console.error('toggleSubscription error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/subscriptions
 * Returns channels that the logged-in user subscribed to.
 * Each channel is populated with a subset of videos (limit 4)
 */
export const getSubscribedChannels = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'subscriptions',
      populate: {
        path: 'videos',
        options: { sort: { uploadDate: -1 }, limit: 4 },
        populate: { path: 'uploader', select: 'username' } // Add this to populate uploader
      }
    });

    const subs = (user.subscriptions || []).map(c => ({
      _id: c._id,
      channelName: c.channelName || c.name || c.channelName,
      channelBanner: c.channelBanner || c.banner || '',
      owner: c.owner,
      subscribersCount: (c.subscribers || []).length,
      videos: (c.videos || []).map(v => ({
        _id: v._id,
        title: v.title,
        thumbnailUrl: v.thumbnailUrl,
        uploader: v.uploader, // Include uploader here
      }))
    }));

    res.json(subs);
  } catch (err) {
    console.error('getSubscribedChannels error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

