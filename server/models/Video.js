// backend/models/Video.js
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String },
  videoUrl:     { type: String, required: true },
  thumbnailUrl: { type: String },
  uploader:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  channel:      { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
  category:     { type: String, default: '' },
  views:        { type: Number, default: 0 },
  likes:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  uploadDate:   { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Video', videoSchema);
