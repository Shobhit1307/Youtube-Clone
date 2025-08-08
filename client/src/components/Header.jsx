// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiMenu } from 'react-icons/fi';
import { logout } from '../features/user/userSlice.js';
import { persistor } from '../app/store.js';
import apiClient from '../api/apiClient.js';
import { getVideos } from '../features/videos/videosSlice.js';

export default function Header({ onMenuClick }) {
  const { userInfo } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [term, setTerm] = useState('');
  // suggestions: { videos: [], channels: [] }
  const [suggestions, setSuggestions] = useState({ videos: [], channels: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  // standard search submit (keeps your old behavior)
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

  // Autocomplete suggestions (debounced)
  useEffect(() => {
    if (!term.trim()) {
      setSuggestions({ videos: [], channels: [] });
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
        // fail silently — suggestions are optional
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

  return (
    <header className="header" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem', background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
      <button className="menu-btn" onClick={onMenuClick} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
        <FiMenu size={22} />
      </button>

      <Link to="/" className="logo" style={{ fontWeight: 700, fontSize: '1.25rem' }}>YouTubeClone</Link>

      {!hideSearch && (
        <form className="header-search" onSubmit={handleSearch} style={{ flex: 1, maxWidth: 600, position: 'relative' }} autoComplete="off">
          <input
            type="text"
            placeholder="Search videos or channels"
            value={term}
            onChange={e => setTerm(e.target.value)}
            onFocus={() => term && setShowSuggestions(true)}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '2px 0 0 2px' }}
          />
          <button type="submit" style={{ padding: '0.5rem 0.9rem', background: '#cc0000', color: '#fff', border: 'none', borderRadius: '0 2px 2px 0', cursor: 'pointer' }}>Search</button>

          {showSuggestions && ( (suggestions.videos && suggestions.videos.length) || (suggestions.channels && suggestions.channels.length) ) && (
            <div className="search-suggestions" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', maxHeight: 320, overflowY: 'auto', zIndex: 1000, borderRadius: 6 }}>
              {suggestions.videos?.length > 0 && (
                <>
                  <div style={{ padding: '6px 12px', fontWeight: 700, borderBottom: '1px solid #eee' }}>Videos</div>
                  {suggestions.videos.map(v => (
                    <div key={v._id || v.id} onMouseDown={() => selectVideo(v._id || v.id)} style={{ padding: '8px 12px', cursor: 'pointer' }}>{v.title}</div>
                  ))}
                </>
              )}
              {suggestions.channels?.length > 0 && (
                <>
                  <div style={{ padding: '6px 12px', fontWeight: 700, borderTop: '1px solid #eee' }}>Channels</div>
                  {suggestions.channels.map(c => (
                    <div key={c._id || c.id} onMouseDown={() => selectChannel(c._id || c.id)} style={{ padding: '8px 12px', cursor: 'pointer' }}>{c.channelName}</div>
                  ))}
                </>
              )}
            </div>
          )}
        </form>
      )}

      {/* user auth area */}
      {userInfo ? (
        <div className="header-auth" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img
            src={userInfo.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
            alt="avatar"
            className="header-avatar"
            style={{ width: 32, height: 32, borderRadius: '50%' }}
          />
          <span>Hello, {userInfo.username}</span>
          <button onClick={handleLogout} style={{ marginLeft: 8, padding: '6px 8px', cursor: 'pointer' }}>Logout</button>
        </div>
      ) : (
        <Link to="/auth" className="header-auth">Sign In</Link>
      )}
    </header>
  );
}
