import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import apiClient from '../api/apiClient.js';
import { useNavigate } from 'react-router-dom';

export default function CreateChannelPage() {
  const [form, setForm] = useState({ channelName: '', description: '', channelBanner: '' });
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await apiClient.post('/channels', form);
      navigate('/');
    } catch (err) {
      console.error('Error creating channel:', err);
    }
  };

  return (
    <>
      <Header />
      <div className="main-content">
        <h2>Create Your Channel</h2>
        <form onSubmit={handleSubmit} className="channel-form">
          <input
            name="channelName"
            placeholder="Channel Name"
            value={form.channelName}
            onChange={handleChange}
            required
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            name="channelBanner"
            placeholder="Banner Image URL"
            value={form.channelBanner}
            onChange={handleChange}
          />
          <button type="submit">Create</button>
        </form>
      </div>
    </>
  );
}
