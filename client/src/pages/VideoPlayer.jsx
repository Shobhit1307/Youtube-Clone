// src/pages/VideoPlayer.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header.jsx';
import apiClient from '../api/apiClient.js';

export default function VideoPlayer() {
  const { id } = useParams();
  const { userInfo } = useSelector(state => state.user);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [mode, setMode] = useState('hidden'); // modes: hidden, view, add
  const [text, setText] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    apiClient.get(`/videos/${id}`).then(res => setVideo(res.data));
  }, [id]);

  const loadComments = () => {
    apiClient.get(`/videos/${id}/comments`).then(res => setComments(res.data));
    setMode('view');
  };

  const handleLike = async () => {
    const { data } = await apiClient.post(`/videos/${id}/like`);
    setVideo(prev => ({ ...prev, likes: data.likes, dislikes: data.dislikes }));
  };
  const handleDislike = async () => {
    const { data } = await apiClient.post(`/videos/${id}/dislike`);
    setVideo(prev => ({ ...prev, likes: data.likes, dislikes: data.dislikes }));
  };

  const submitNew = async () => {
    const res = await apiClient.post(`/videos/${id}/comments`, { text });
    setComments(prev => [res.data, ...prev]);
    setText('');
    setMode('view');
  };
  const startEdit = c => { setEditId(c._id); setEditText(c.text); };
  const submitEdit = async () => {
    const res = await apiClient.put(`/videos/${id}/comments/${editId}`, { text: editText });
    setComments(prev => prev.map(c => (c._id === editId ? res.data : c)));
    setEditId(null); setEditText('');
  };
  const deleteComment = async cid => {
    await apiClient.delete(`/videos/${id}/comments/${cid}`);
    setComments(prev => prev.filter(c => c._id !== cid));
  };

  if (!video) return <div>Loading video...</div>;

  return (
    <>
      <Header />
      <div className="main-content">
        <video width="100%" controls src={video.videoUrl} />
        <h2>{video.title}</h2>
        <p>{video.description}</p>
        <div>
          <button onClick={handleLike}>Like {video.likes}</button>
          <button onClick={handleDislike}>Dislike {video.dislikes}</button>
        </div>

        <section className="comments-section">
          <button onClick={loadComments}>View Comments</button>
          {userInfo && <button onClick={() => setMode('add')}>Add a Comment</button>}

          {mode === 'add' && userInfo && (
            <div className="comment-form">
              <textarea value={text} onChange={e => setText(e.target.value)} />
              <button onClick={submitNew} disabled={!text.trim()}>Submit</button>
            </div>
          )}

          {mode === 'view' && (
            <div className="comment-list">
              {comments.map(c => (
                <div key={c._id} className="comment-item">
                  <strong>{c.user.username}</strong>:
                  {editId === c._id ? (
                    <>
                      <textarea value={editText} onChange={e => setEditText(e.target.value)} />
                      <button onClick={submitEdit}>Save</button>
                      <button onClick={() => setEditId(null)}>Cancel</button>
                    </>
                  ) : (
                    <span> {c.text}</span>
                  )}
                  {userInfo?.id === c.user._id && editId !== c._id && (
                    <div className="comment-actions">
                      <button onClick={() => startEdit(c)}>Edit</button>
                      <button onClick={() => deleteComment(c._id)}>Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
