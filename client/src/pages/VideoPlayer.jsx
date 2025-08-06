// src/pages/VideoPlayer.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import YouTube from 'react-youtube';
import VideoJS from '../components/VideoJS.jsx';
import apiClient from '../api/apiClient.js';
import Header from '../components/Header.jsx';
import { toast } from 'react-toastify';

export default function VideoPlayer() {
  const { id } = useParams();
  const { userInfo } = useSelector(state => state.user);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [mode, setMode] = useState('hidden');
  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    apiClient.get(`/videos/${id}`)
      .then(res => {
        console.log('[DEBUG] video:', res.data);
        setVideo(res.data);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load video');
      });
  }, [id]);

  if (!video) return (<><Header /><div className="main-content">Loading…</div></>);
  if (!video.videoUrl) return (<><Header /><div className="main-content"><p style={{ color: 'red' }}>⚠️ Invalid video URL</p></div></>);

  const isYT = video.videoUrl.includes('youtube.com/watch');
  const ytId = isYT ? new URL(video.videoUrl).searchParams.get('v') : null;

  return (
    <>
      <Header />
      <div className="main-content video-player">
        {isYT && ytId ? (
          <YouTube videoId={ytId} opts={{ width: '100%', playerVars: { autoplay: 1, controls: 1 } }} />
        ) : (
          <VideoJS
            options={{
              autoplay: true,
              controls: true,
              fluid: true,
              muted: true,
              sources: [{ src: video.videoUrl, type: 'video/mp4' }],
            }}
            onReady={player => console.log('VideoJS ready')}
          />
        )}

        <h2>{video.title}</h2>
        <p>{video.description}</p>

        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => handleReaction('like')}>👍 {video.likes}</button>
          <button onClick={() => handleReaction('dislike')} style={{ marginLeft: '0.5rem' }}>👎 {video.dislikes}</button>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button onClick={loadComments}>View Comments ({comments.length})</button>
          {userInfo && <button onClick={() => setMode('add')} style={{ marginLeft: '1rem' }}>Add Comment</button>}
        </div>

        {mode === 'add' && userInfo && (
          <div style={{ marginTop: '.5rem' }}>
            <textarea rows={3} value={text} onChange={e => setText(e.target.value)} />
            <button onClick={submitNew} disabled={!text.trim()} style={{ marginTop: '.5rem' }}>Submit</button>
          </div>
        )}

        {mode === 'view' && comments.map(c => (
          <div key={c._id} style={{ marginTop: '1rem' }}>
            <strong>{c.user.username}</strong>: {editId === c._id ? (
              <>
                <textarea rows={2} value={editText} onChange={e => setEditText(e.target.value)} />
                <div>
                  <button onClick={submitEdit}>Save</button>
                  <button onClick={() => setEditId(null)} style={{ marginLeft: '.5rem' }}>Cancel</button>
                </div>
              </>
            ) : (
              <span>{c.text}</span>
            )}
            {userInfo?.id === c.user._id && editId !== c._id && (
              <div style={{ marginTop: '0.3rem' }}>
                <button onClick={() => { setEditId(c._id); setEditText(c.text); }}>Edit</button>
                <button onClick={() => handleDelete(c._id)} style={{ marginLeft: '.5rem' }}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );

  function handleReaction(type) {
    apiClient.post(`/videos/${id}/${type}`)
      .then(res => setVideo(v => ({ ...v, likes: res.data.likes, dislikes: res.data.dislikes })))
      .catch(() => toast.error(`Failed to ${type}`));
  }

  function loadComments() {
    apiClient.get(`/videos/${id}/comments`)
      .then(res => { setComments(res.data); setMode('view'); })
      .catch(() => toast.error('Failed to load comments'));
  }

  function submitNew() {
    apiClient.post(`/videos/${id}/comments`, { text })
      .then(res => { setComments(c => [res.data, ...c]); setText(''); setMode('view'); })
      .catch(() => toast.error('Failed to submit comment'));
  }

  function submitEdit() {
    apiClient.put(`/videos/${id}/comments/${editId}`, { text: editText })
      .then(res => { setComments(c => c.map(x => x._id === editId ? res.data : x)); setEditId(null); setEditText(''); })
      .catch(() => toast.error('Failed to edit comment'));
  }

  function handleDelete(cid) {
    apiClient.delete(`/videos/${id}/comments/${cid}`)
      .then(() => setComments(c => c.filter(x => x._id !== cid)))
      .catch(() => toast.error('Failed to delete comment'));
  }
}
