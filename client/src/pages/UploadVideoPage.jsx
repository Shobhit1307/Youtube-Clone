import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import apiClient from '../api/apiClient.js';

export default function UploadVideo() {
  const navigate = useNavigate();
  const { myChannel } = useSelector(state => state.channel);
  const [mode, setMode] = useState('file');
  const [form, setForm] = useState({ title: '', category: '', thumbnailUrl: '', externalUrl: '', description: '' });
  const [file, setFile] = useState(null);

  if (!myChannel) {
    toast.info('Create a channel first.');
    return <div className="main-content error">Please create your channel before uploading videos.</div>;
  }

  const onChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (mode === 'file' && !file) return toast.error('Please pick a file.');
    if (mode === 'link' && !form.externalUrl) return toast.error('Please paste a YouTube/Vimeo link.');

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v && k !== 'externalUrl') data.append(k, v); });
    data.append('channelId', myChannel._id);

    if (mode === 'file') data.append('videoFile', file);
    else data.append('externalUrl', form.externalUrl);

    try {
      await apiClient.post('/videos', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Video uploaded.');
      navigate(`/channel/${myChannel._id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  return (
    <>
      
      <div className="main-content upload-page">
        <h2 className="page-title">Upload Video</h2>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              checked={mode === 'file'}
              onChange={() => setMode('file')}
              className="radio-input"
            />
            Upload File
          </label>
          <label className="radio-label">
            <input
              type="radio"
              checked={mode === 'link'}
              onChange={() => setMode('link')}
              className="radio-input"
            />
            Use YouTube/Vimeo Link
          </label>
        </div>
        <form onSubmit={handleSubmit} className="upload-form">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={onChange}
            required
            className="upload-input"
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={onChange}
            required
            className="upload-input"
          />
          {mode === 'link' && (
            <input
              name="externalUrl"
              type="url"
              placeholder="https://youtube.com/watch?v=…"
              value={form.externalUrl}
              onChange={onChange}
              autoComplete="off"
              className="upload-input"
            />
          )}
          {mode === 'file' && (
            <input
              type="file"
              accept="video/*"
              onChange={e => setFile(e.target.files[0] || null)}
              className="upload-file-input"
            />
          )}
          <input
            name="thumbnailUrl"
            placeholder="Thumbnail URL (optional)"
            value={form.thumbnailUrl}
            onChange={onChange}
            className="upload-input"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={onChange}
            rows={4}
            className="upload-textarea"
          />
          <button type="submit" className="submit-button">Upload Video</button>
        </form>
      </div>
    </>
  );
}