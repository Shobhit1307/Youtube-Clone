import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import apiClient from '../api/apiClient.js';
import { toast } from 'react-toastify';

export default function EditVideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', thumbnailUrl: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/videos/${id}`)
      .then(res => {
        setVideo(res.data);
        setForm({
          title: res.data.title || '',
          description: res.data.description || '',
          category: res.data.category || '',
          thumbnailUrl: res.data.thumbnailUrl || ''
        });
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load video');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Header /><div className="main-content loading">Loading…</div></>;

  if (!video) return <><Header /><div className="main-content error">Video not found</div></>;

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/videos/${id}`, form);
      toast.success('Video updated');
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <>
      
      <div className="main-content upload-page">
        <h2 className="page-title">Edit Video</h2>
        <form className="upload-form" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="upload-input"
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="upload-input"
          />
          <input
            name="thumbnailUrl"
            placeholder="Thumbnail URL"
            value={form.thumbnailUrl}
            onChange={handleChange}
            className="upload-input"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            className="upload-textarea"
          />
          <div className="form-actions">
            <button type="submit" className="submit-button">Save Changes</button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}