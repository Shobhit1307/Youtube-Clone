// src/pages/ChannelPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header.jsx';
import VideoCard from '../components/VideoCard.jsx';
import apiClient from '../api/apiClient.js';

export default function ChannelPage() {
  const { id } = useParams();
  const { userInfo } = useSelector(state => state.user);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch channel by ID
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await apiClient.get(`/channels/${id}`);
        setChannel(res.data);
      } catch (error) {
        console.error('Error fetching channel:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChannel();
  }, [id]);

  // Handle Delete
  const handleDelete = useCallback(async videoId => {
    try {
      await apiClient.delete(`/videos/${videoId}`);
      setChannel(prev => ({
        ...prev,
        videos: prev.videos.filter(v => v._id !== videoId),
      }));
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  }, []);

  if (loading) return <div className="loading">Loading channel...</div>;
  if (!channel) return <div className="error">Channel not found.</div>;

  const isOwner = userInfo && userInfo._id === channel.owner;

  return (
    <>
      <Header />
      <div className="main-content">
        <h1>{channel.channelName}</h1>
        <p>{channel.description}</p>

        <div className="video-grid">
          {channel.videos.map(video => (
            <div key={video._id} className="video-wrapper">
              <VideoCard video={video} />
              {isOwner && (
                <button onClick={() => handleDelete(video._id)} className="delete-btn">
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
