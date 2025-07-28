// VideoCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function VideoCard({ video }) {
  return (
    <div className="video-card">
      <Link to={`/video/${video._id}`}>
        <img loading="lazy" src={video.thumbnailUrl} alt={video.title} />
        <h4>{video.title}</h4>
        <p>{video.uploader.username} • {video.views} views</p>
      </Link>
    </div>
  );
}

export default React.memo(VideoCard);
