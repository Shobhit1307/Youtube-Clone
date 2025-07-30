// src/pages/UploadVideoPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import apiClient from '../api/apiClient.js';
import { useNavigate } from 'react-router-dom';

export default function UploadVideoPage() {
  const { id: channelId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: ''
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await apiClient.post('/videos', { ...form, channelId });
    navigate(`/channel/${channelId}`);
  };

  return (
    <>
      <Header />
      <div className="main-content upload-page">
        <h2>Upload New Video</h2>
        <form className="upload-form" onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" onChange={handleChange} required />
          <input name="videoUrl" placeholder="Video URL" onChange={handleChange} required />
          <input name="thumbnailUrl" placeholder="Thumbnail URL" onChange={handleChange} />
          <input name="category" placeholder="Category" onChange={handleChange} required />
          <textarea name="description" rows={4} placeholder="Description" onChange={handleChange} />
          <button type="submit">Upload</button>
        </form>
      </div>
    </>
  );
}
