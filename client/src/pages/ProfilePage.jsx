import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header.jsx';
import apiClient from '../api/apiClient.js';
import VideoCard from '../components/VideoCard.jsx';

export default function ProfilePage() {
  const { userInfo } = useSelector(state => state.user);
  const { myChannel } = useSelector(state => state.channel);
  const [avatar, setAvatar] = useState(userInfo?.avatar || '');
  const [likedVideos, setLikedVideos] = useState([]);
  const [commentedVideos, setCommentedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const res = await apiClient.get('/auth/profile');
        setAvatar(res.data.user.avatar || '');
        setLikedVideos(res.data.likedVideos || []);
        setCommentedVideos(res.data.commentedVideos || []);
      } catch (err) {
        console.error('Failed to load profile data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, []);

  const handleUpdate = async () => {
    try {
      await apiClient.put('/auth/profile', { avatar });
      window.location.reload();
    } catch (err) {
      console.error('Update avatar failed:', err);
    }
  };

  return (
    <>
      <Header />
      <div className="main-content profile-page">
        <h2 className="page-title">Your Profile</h2>
        <img
          src={avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
          alt="avatar"
          className="profile-avatar"
        />
        <p className="profile-username">Username: {userInfo?.username}</p>
        <div className="profile-form">
          <input
            type="text"
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
            placeholder="Avatar URL"
            className="profile-input"
          />
          <button onClick={handleUpdate} className="submit-button">Update Avatar</button>
        </div>

        {myChannel && (
          <div className="channel-info">
            <h3 className="section-title">Your Channel</h3>
            <p className="channel-name">Name: {myChannel.channelName}</p>
            <p className="channel-description">Description: {myChannel.description}</p>
            {myChannel.channelBanner && (
              <img
                src={myChannel.channelBanner}
                alt="Banner"
                className="channel-banner"
              />
            )}
          </div>
        )}

        <div className="video-section">
          <h3 className="section-title">Liked Videos</h3>
          {loading ? <p className="loading">Loading…</p> : likedVideos.length === 0 ? (
            <p className="no-videos">No liked videos</p>
          ) : (
            <div className="video-grid">
              {likedVideos.map(v => <VideoCard key={v._id} video={v} />)}
            </div>
          )}
        </div>

        <div className="video-section">
          <h3 className="section-title">Commented Videos</h3>
          {loading ? <p className="loading">Loading…</p> : commentedVideos.length === 0 ? (
            <p className="no-videos">No commented videos</p>
          ) : (
            <div className="video-grid">
              {commentedVideos.map(v => <VideoCard key={v._id} video={v} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}