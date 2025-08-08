// src/pages/ProfilePage.jsx
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
      
      <div className="main-content profile-page">
        <h2>Your Profile</h2>
        <img
          src={avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
          alt="avatar"
          className="profile-avatar"
        />
        <p>Username: {userInfo?.username}</p>
        <input
          type="text"
          value={avatar}
          onChange={e => setAvatar(e.target.value)}
          placeholder="Avatar URL"
        />
        <button onClick={handleUpdate}>Update Avatar</button>

        {myChannel && (
          <div className="your-channel-info" style={{ marginTop: 20 }}>
            <h3>Your Channel:</h3>
            <p>Name: {myChannel.channelName}</p>
            <p>Description: {myChannel.description}</p>
            {myChannel.channelBanner && <img src={myChannel.channelBanner} alt="Banner" className="channel-banner" />}
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <h3>Liked Videos</h3>
          {loading ? <p>Loading…</p> : likedVideos.length === 0 ? <p>No liked videos</p> : (
            <div className="video-grid">
              {likedVideos.map(v => <VideoCard key={v._id} video={v} />)}
            </div>
          )}
        </div>

        <div style={{ marginTop: 32 }}>
          <h3>Commented Videos</h3>
          {loading ? <p>Loading…</p> : commentedVideos.length === 0 ? <p>No commented videos</p> : (
            <div className="video-grid">
              {commentedVideos.map(v => <VideoCard key={v._id} video={v} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
