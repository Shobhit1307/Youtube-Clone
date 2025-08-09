import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import FilterButtons from '../components/FilterButtons.jsx';
import VideoCard from '../components/VideoCard.jsx';
import { getVideos, likeVideo } from '../features/videos/videosSlice.js';

export default function HomePage() {
  const dispatch = useDispatch();
  const videos = useSelector(state => state.videos.list);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    dispatch(getVideos({ search, category }));
  }, [dispatch, search, category]);

  const onSelectCategory = useCallback((cat) => {
    const params = {};
    if (cat && cat !== 'All') params.category = cat;
    if (search) params.search = search;
    setSearchParams(params);
  }, [setSearchParams, search]);

  const onLike = useCallback(id => dispatch(likeVideo(id)), [dispatch]);

  const activeCategory = category || 'All';

  return (
    <div className="main-content home-page">
      <FilterButtons active={activeCategory} onSelect={onSelectCategory} />
      <div className="video-grid">
        {videos.map(video => (
          <VideoCard key={video._id} video={video} onLike={onLike} />
        ))}
      </div>
    </div>
  );
}