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
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChannel() {
      try {
        const res = await apiClient.get(`/channels/${id}`);
        setChannel(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchChannel();
  }, [id]);

  const handleDelete = useCallback(async vidId => {
    await apiClient.delete(`/videos/${vidId}`);
    setChannel(prev => ({
      ...prev,
      videos: prev.videos.filter(v => v._id !== vidId)
    }));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!channel) return <div>Channel not found.</div>;

  const isOwner = userInfo?._id === channel.owner._id;

  return (
    <>
      <Header />
      <div className="main-content">
        <h1>{channel.channelName}</h1>
        <p>{channel.description}</p>
        {isOwner && (
          <button onClick={() => navigate(`/channel/${channel._id}/upload`)}>
            Upload Video
          </button>
        )}
        <div className="video-grid">
          {channel.videos.map(v => (
            <div key={v._id} className="video-wrapper">
              <VideoCard video={v} />
              {isOwner && (
                <button
                  onClick={() => handleDelete(v._id)}
                  className="delete-btn"
                >
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
