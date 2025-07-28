import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import apiClient from '../api/apiClient.js';

export default function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    apiClient.get(`/videos/${id}`).then(res => {
      setVideo(res.data);
      setComments(res.data.comments || []);
    });
  }, [id]);

  const handleCommentSubmit = useCallback(async () => {
    const res = await apiClient.post(`/videos/${id}/comment`, { text });
    setComments(prev => [...prev, res.data]);
    setText('');
  }, [id, text]);

  if (!video) return <div className="loading">Loading video...</div>;

  return (
    <>
      <Header />
      <div className="main-content">
        <video width="100%" controls src={video.videoUrl}></video>
        <h2>{video.title}</h2>
        <p>{video.description}</p>
        <div>
          <button onClick={() => apiClient.post(`/videos/${id}/like`)}>Like {video.likes}</button>
          <button onClick={() => apiClient.post(`/videos/${id}/dislike`)}>Dislike {video.dislikes}</button>
        </div>
        <section>
          <h3>Comments</h3>
          {comments.map(c => (
            <div key={c.commentId}>
              <strong>{c.userId}</strong>: {c.text}
            </div>
          ))}
          <textarea value={text} onChange={e => setText(e.target.value)} />
          <button onClick={handleCommentSubmit} disabled={!text.trim()}>
            Add Comment
          </button>
        </section>
      </div>
    </>
  );
}
