import React, { useEffect, useState } from 'react';
import Header from '../components/Header.jsx';
import VideoCard from '../components/VideoCard.jsx';
import apiClient from '../api/apiClient.js';

export default function TrendingPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    apiClient.get('/videos/trending').then(res => setVideos(res.data));
  }, []);

  return (
    <>
      <Header />
      <div className="app-body">
        <main className="main-content trending-page">
          <h2 className="page-title">🔥 Trending Videos</h2>
          <div className="video-grid">
            {videos.map(v => <VideoCard key={v._id} video={v} />)}
          </div>
        </main>
      </div>
    </>
  );
}