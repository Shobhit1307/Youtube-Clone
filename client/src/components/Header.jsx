// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiMenu } from 'react-icons/fi';
import { logout } from '../features/user/userSlice.js';
import { persistor } from '../app/store.js';
import apiClient from '../api/apiClient.js';
import { getVideos } from '../features/videos/videosSlice.js';
import getAvatarUrl from '../utils/getAvatarUrl.js';

export default function Header({ onMenuClick }) {
  const { userInfo } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState({ videos: [], channels: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getVideos({ search: term.trim(), category: '' }));
    navigate('/');
  };

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    delete apiClient.defaults.headers.common.Authorization;
    navigate('/');
  };

  const hideSearch = location.pathname === '/auth';

  useEffect(() => {
    if (!term.trim()) {
      setShowSuggestions(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await apiClient.get(`/search?q=${encodeURIComponent(term.trim())}`);
        setSuggestions(res.data || { videos: [], channels: [] });
        setShowSuggestions(true);
      } catch (err) {
        console.error('Search suggestion error', err);
      }
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [term]);

  function selectVideo(id) {
    setShowSuggestions(false);
    setTerm('');
    navigate(`/video/${id}`);
  }

  function selectChannel(id) {
    setShowSuggestions(false);
    setTerm('');
    navigate(`/channel/${id}`);
  }

  // Theme toggle handler
  const toggleTheme = () => {
    const current = document.documentElement.dataset.theme;
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  };

  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick}>
        <FiMenu size={22} />
      </button>
      <Link to="/" className="logo">YouTubeClone</Link>

      {!hideSearch && (
        <form className="header-search" onSubmit={handleSearch} autoComplete="off">
          <input
            type="text"
            placeholder="Search videos or channels"
            value={term}
            onChange={e => setTerm(e.target.value)}
            onFocus={() => term && setShowSuggestions(true)}
            className="header-search-input"
          />
          <button type="submit" className="header-search-button">Search</button>
          {showSuggestions && (suggestions.videos.length || suggestions.channels.length) && (
            <div className="search-suggestions">
              {suggestions.videos.length > 0 && (
                <>
                  <div className="suggestion-header">Videos</div>
                  {suggestions.videos.map(v => (
                    <div key={v._id || v.id} onMouseDown={() => selectVideo(v._id || v.id)} className="suggestion-item">
                      {v.title}
                    </div>
                  ))}
                </>
              )}
              {suggestions.channels.length > 0 && (
                <>
                  <div className="suggestion-header">Channels</div>
                  {suggestions.channels.map(c => (
                    <div key={c._id || c.id} onMouseDown={() => selectChannel(c._id || c.id)} className="suggestion-item">
                      {c.channelName}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </form>
      )}

      <div className="header-actions">
        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label="Toggle light/dark theme"
        >
          {/* Use an emoji or SVG icon */}
          🌓
        </button>
        </div>

        {userInfo ? (
          <div className="header-auth">
            <img
              src={getAvatarUrl(userInfo.avatar)}
              alt="avatar"
              className="header-avatar"
              onError={e => (e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png')}
            />
            <span className="header-username">Hello, {userInfo.username}</span>
            <button onClick={handleLogout} className="header-logout-button">Logout</button>
          </div>
        ) : (
          <div>
            <Link to="/auth" className="header-auth-link">Sign In</Link>
          </div>
          
        )}
      
    </header>
  );
}
