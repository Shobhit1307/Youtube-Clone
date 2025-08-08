// src/pages/ChannelPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header.jsx';
import VideoCard from '../components/VideoCard.jsx';
import apiClient from '../api/apiClient.js';

export default function ChannelPage() {
  const { id } = useParams();
  const { userInfo } = useSelector(state => state.user);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChannel() {
      try {
        const res = await apiClient.get(`/channels/${id}`);
        setChannel(res.data);

        // Check subscription status if user logged in
        if (userInfo && res.data.subscribers) {
          setIsSubscribed(res.data.subscribers.includes(userInfo._id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchChannel();
  }, [id, userInfo]);

  const handleDelete = useCallback(async vidId => {
    if (!confirm('Delete this video permanently?')) return;
    try {
      await apiClient.delete(`/videos/${vidId}`);
      setChannel(prev => ({
        ...prev,
        videos: prev.videos.filter(v => v._id !== vidId)
      }));
    } catch (err) {
      console.error('Error deleting video:', err);
      alert('Delete failed');
    }
  }, []);

  const handleToggleSubscribe = async () => {
    if (!userInfo) {
      alert('Please log in to subscribe.');
      return;
    }
    try {
      const res = await apiClient.post(`/channels/${id}/toggle-subscription`);
      setIsSubscribed(res.data.isSubscribed);

      // Update subscriber count locally
      setChannel(prev => ({
        ...prev,
        subscribers: res.data.subscriberCount,
      }));
    } catch (err) {
      console.error('Error toggling subscription:', err);
      alert('Subscription update failed.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!channel) return <div>Channel not found.</div>;

  const isOwner = userInfo?._id === channel.owner._id;

  return (
    <>
      
      <div className="main-content">
        {channel.channelBanner && (
          <img
            src={channel.channelBanner}
            alt="channel banner"
            style={{ width: '100%', borderRadius: 6, marginBottom: 12 }}
          />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <h1>{channel.channelName}</h1>
          <span style={{ fontWeight: 'bold', color: '#555' }}>
            {channel.subscribers?.length ?? channel.subscribers} subscribers
          </span>
          {!isOwner && (
            <button
              onClick={handleToggleSubscribe}
              style={{
                backgroundColor: isSubscribed ? '#ccc' : '#cc0000',
                color: isSubscribed ? '#000' : '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>

        <p>{channel.description}</p>

        {isOwner && (
          <button onClick={() => navigate(`/channel/${channel._id}/upload`)}>
            Upload Video
          </button>
        )}

        <div className="video-grid" style={{ marginTop: 16 }}>
          {channel.videos && channel.videos.length > 0 ? (
            channel.videos.map(v => (
              <div key={v._id} className="video-wrapper">
                <VideoCard video={v} />
                {isOwner && (
                  <div style={{ marginTop: 6 }}>
                    <button className="edit-btn" onClick={() => navigate(`/video/${v._id}/edit`)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(v._id)}>Delete</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No videos uploaded yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
