// src/components/Header.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/user/userSlice.js';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
          Hello, {userInfo.username}{' '}
          <button onClick={() => { dispatch(logout()); navigate('/'); }}>
            Logout
          </button>
        </div>
      ) : (
        <Link to="/auth" className="header-auth">Sign In</Link>
      )}
    </header>
  );
}
