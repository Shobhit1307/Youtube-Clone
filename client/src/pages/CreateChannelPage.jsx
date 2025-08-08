import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import apiClient from '../api/apiClient.js';

export default function CreateChannelPage() {
  const [form, setForm] = useState({
    channelName: '',
    description: '',
    channelBanner: ''
  });
  const navigate = useNavigate();

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/channels', form);
      navigate(`/channel/${res.data._id}`);
    } catch (err) {
      if (err.response?.status === 400) {
        alert('You already have a channel');
        navigate(`/channel/${err.response.data.channelId}`);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <>
      
      <div className="main-content">
        <h2>Create Your Channel</h2>
        <form className="channel-form" onSubmit={handleSubmit}>
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
            placeholder="Banner URL"
            value={form.channelBanner}
            onChange={handleChange}
          />
          <button type="submit">Create</button>
        </form>
      </div>
    </>
  );
}
