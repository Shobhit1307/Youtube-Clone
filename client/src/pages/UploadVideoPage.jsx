// src/pages/UploadVideoPage.jsx
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
    return <div>Please create your channel before uploading videos.</div>;
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
      <Header />
      <div><h2>Upload Video</h2>
        <div>
          <label><input checked={mode === 'file'} type="radio" onChange={() => setMode('file')} /> Upload File</label>
          <label><input checked={mode === 'link'} type="radio" onChange={() => setMode('link')} /> Use YouTube/Vimeo Link</label>
        </div>
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" value={form.title} onChange={onChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={onChange} required />
          {mode === 'link' && (
            <input name="externalUrl" type="url" placeholder="https://youtube.com/watch?v=…" value={form.externalUrl} onChange={onChange} autoComplete="off" />
          )}
          {mode === 'file' && (
            <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0] || null)} />
          )}
          <input name="thumbnailUrl" placeholder="Thumbnail URL (optional)" value={form.thumbnailUrl} onChange={onChange} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={onChange} rows={4} />
          <button type="submit">Upload Video</button>
        </form>
      </div>
    </>
  );
}
