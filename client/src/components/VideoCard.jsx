import React from 'react';
import { Link } from 'react-router-dom';

function VideoCard({ video }) {
  return (
    <div className="video-card">
      <Link to={`/video/${video._id}`} className="video-card-link">
        <img
          loading="lazy"
          src={video.thumbnailUrl}
          alt={video.title}
          className="video-card-thumbnail"
        />
        <h4 className="video-card-title">{video.title}</h4>
        <p className="video-card-meta">{video.uploader.username} • {video.views} views</p>
      </Link>
    </div>
  );
}

export default React.memo(VideoCard);