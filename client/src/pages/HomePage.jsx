// HomePage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import FilterButtons from '../components/FilterButtons.jsx';
import VideoCard from '../components/VideoCard.jsx';
import { getVideos, likeVideo } from '../features/videos/videosSlice.js';

function HomePage() {
  const dispatch = useDispatch();
  const videos = useSelector(state => state.videos.list);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    dispatch(getVideos({ search: '', category: category === 'All' ? '' : category }));
  }, [dispatch, category]);

  const onSelectCategory = useCallback(setCategory, []);
  const onLike = useCallback(id => dispatch(likeVideo(id)), [dispatch]);

  return (
    <>
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <FilterButtons active={category} onSelect={onSelectCategory} />
          <div className="video-grid">
            {videos.map(video => (
              <VideoCard key={video._id} video={video} onLike={onLike} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default HomePage;
