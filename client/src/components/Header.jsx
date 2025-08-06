import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/user/userSlice.js';
import { persistor } from '../app/store.js';
import apiClient from '../api/apiClient.js';
import { getVideos } from '../features/videos/videosSlice.js';

export default function Header() {
  const { userInfo } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [term, setTerm] = useState('');

  const handleSearch = e => {
    e.preventDefault();
    dispatch(getVideos({ search: term, category: '' }));
    navigate('/');
  };

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    delete apiClient.defaults.headers.common.Authorization;
    navigate('/');
  };

  const hideSearch = location.pathname === '/auth';

  return (
    <header className="header">
      <Link to="/" className="logo">YouTubeClone</Link>
      {!hideSearch && (
        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search videos..."
            value={term}
            onChange={e => setTerm(e.target.value)}
            required
          />
          <button type="submit">Search</button>
        </form>
      )}
      {userInfo ? (
        <div className="header-auth">
          <img
            src={userInfo.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
            alt="avatar"
            className="header-avatar"
          />
          <span>Hello, {userInfo.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <Link to="/auth" className="header-auth">Sign In</Link>
      )}
    </header>
  );
}
