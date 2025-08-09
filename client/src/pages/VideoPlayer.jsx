// src/pages/VideoPlayer.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import YouTube from 'react-youtube';
import VideoJS from '../components/VideoJS.jsx';
import VideoCard from '../components/VideoCard.jsx';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient.js';

export default function VideoPlayer() {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.user);
  const [video, setVideo] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [mode, setMode] = useState('hidden');
  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const fetchGuard = useRef(false);

  useEffect(() => {
    if (fetchGuard.current) return;
    fetchGuard.current = true;

    Promise.all([
      apiClient.get(`/videos/${id}`),
      apiClient.get(`/videos/recommended/${id}`)
    ])
      .then(([videoRes, recommendedRes]) => {
        setVideo(videoRes.data);
        setRecommendedVideos(recommendedRes.data || []);
        const ch = videoRes.data.channel;
        setSubscribersCount(ch?.subscribers?.length || 0);
        const uid = userInfo?._id;
        if (uid && ch?.subscribers) {
          setIsSubscribed(ch.subscribers.some(s => s._id ? s._id === uid : s === uid));
        } else {
          setIsSubscribed(false);
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        toast.error('Failed to load video or recommendations');
      })
      .finally(() => (fetchGuard.current = false));
  }, [id, userInfo]);

  if (!video) {
    return <p className="loading">Loading…</p>;
  }

  if (!video.videoUrl) {
    return <p className="error">⚠️ Invalid video URL</p>;
  }

  const isYT = video.videoUrl.includes('youtube.com/watch');
  const ytId = isYT ? new URL(video.videoUrl).searchParams.get('v') : null;

  async function toggleSubscribe() {
    if (!userInfo) {
      toast.info('Please login to subscribe');
      return;
    }
    try {
      const res = await apiClient.post(`/subscriptions/${video.channel?._id}`);
      setIsSubscribed(res.data.subscribed);
      setSubscribersCount(res.data.subscribersCount);
    } catch (err) {
      console.error('Subscribe error:', err);
      toast.error('Failed to toggle subscription');
    }
  }

  function handleReaction(type) {
    if (!userInfo) {
      toast.info('Please login to react');
      return;
    }
    apiClient
      .post(`/videos/${id}/${type}`)
      .then((res) =>
        setVideo((v) => ({ ...v, likes: res.data.likes, dislikes: res.data.dislikes }))
      )
      .catch(() => toast.error(`Failed to ${type}`));
  }

  function loadComments() {
    apiClient
      .get(`/videos/${id}/comments`)
      .then((res) => {
        setComments(res.data || []);
        setMode('view');
      })
      .catch(() => toast.error('Failed to load comments'));
  }

  function submitNew() {
    if (!text.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    apiClient
      .post(`/videos/${id}/comments`, { text })
      .then((res) => {
        setComments((c) => [res.data, ...c]);
        setText('');
        setMode('view');
      })
      .catch(() => toast.error('Failed to submit comment'));
  }

  function submitEdit() {
    if (!editText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    apiClient
      .put(`/videos/${id}/comments/${editId}`, { text: editText })
      .then((res) => {
        setComments((c) => c.map((x) => (x._id === editId ? res.data : x)));
        setEditId(null);
        setEditText('');
      })
      .catch(() => toast.error('Failed to edit comment'));
  }

  function handleDelete(cid) {
    apiClient
      .delete(`/videos/${id}/comments/${cid}`)
      .then(() => setComments((c) => c.filter((x) => x._id !== cid)))
      .catch(() => toast.error('Failed to delete comment'));
  }

  return (
    <div className="video-player-page">
      <div className="video-player-container">
        <div className="video-wrapper">
          {isYT && ytId ? (
            <YouTube
              videoId={ytId}
              opts={{ width: '100%', playerVars: { autoplay: 1, controls: 1 } }}
              className="youtube-player"
            />
          ) : (
            <VideoJS
              options={{
                autoplay: true,
                controls: true,
                fluid: true,
                muted: true,
                sources: [{ src: video.videoUrl, type: 'video/mp4' }],
              }}
              className="video-js-player"
              onReady={(player) => console.log('VideoJS ready')}
            />
          )}
        </div>
        <div className="video-info">
          <h2 className="video-title">{video.title || 'Untitled Video'}</h2>
          <p className="video-description">{video.description || 'No description'}</p>
          <div className="video-channel-info">
            <Link to={`/channel/${video.channel?._id}`}>
              <img
                src={video.channel?.channelBanner || video.uploader?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                alt="channel"
                className="channel-avatar"
              />
            </Link>
            <div className="channel-details">
              <Link to={`/channel/${video.channel?._id}`} className="channel-name">
                {video.channel?.channelName || video.uploader?.username || 'Unknown'}
              </Link>
              <div className="subscribers-count">{subscribersCount} subscribers</div>
            </div>
            {userInfo && userInfo._id !== String(video.channel?.owner?._id || video.channel?.owner) && (
              <button
                className={`subscribe-button ${isSubscribed ? 'subscribed' : ''}`}
                onClick={toggleSubscribe}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>
          <div className="video-actions">
            <button className="action-button" onClick={() => handleReaction('like')}>
              👍 {video.likes || 0}
            </button>
            <button className="action-button" onClick={() => handleReaction('dislike')}>
              👎 {video.dislikes || 0}
            </button>
          </div>
        </div>
        <div className="comments-section">
          <div className="comments-header">
            <button className="comment-toggle" onClick={loadComments}>
              Comments ({comments.length})
            </button>
            {userInfo && (
              <button className="comment-toggle" onClick={() => setMode('add')}>
                Add Comment
              </button>
            )}
          </div>
          {mode === 'add' && userInfo && (
            <div className="comment-form">
              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
                className="comment-textarea"
              />
              <div className="comment-form-actions">
                <button
                  className="submit-button"
                  onClick={submitNew}
                  disabled={!text.trim()}
                >
                  Submit
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setMode('view')}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {mode === 'view' && comments.length > 0 && (
            <div className="comments-list">
              {comments.map((c) => (
                <div key={c._id} className="comment">
                  <div className="comment-header">
                    <strong className="comment-username">{c.user?.username || 'Unknown'}</strong>
                  </div>
                  {editId === c._id ? (
                    <div className="comment-edit">
                      <textarea
                        rows={2}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        placeholder="Edit your comment..."
                        className="comment-textarea"
                      />
                      <div className="comment-form-actions">
                        <button className="submit-button" onClick={submitEdit}>
                          Save
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="comment-text">{c.text}</p>
                  )}
                  {userInfo?._id === c.user?._id && editId !== c._id && (
                    <div className="comment-actions">
                      <button
                        className="comment-action-button"
                        onClick={() => {
                          setEditId(c._id);
                          setEditText(c.text);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="comment-action-button"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="recommended-videos">
        <h3 className="recommended-header">Recommended Videos</h3>
        <div className="video-grid">
          {recommendedVideos.length > 0 ? (
            recommendedVideos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))
          ) : (
            <p className="no-videos">No recommended videos</p>
          )}
        </div>
      </div>
    </div>
  );
}