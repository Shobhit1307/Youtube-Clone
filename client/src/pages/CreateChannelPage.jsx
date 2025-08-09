import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from '../components/Header.jsx';
import apiClient from '../api/apiClient.js';
import { fetchMyChannel } from '../features/channel/channelSlice.js';

export default function CreateChannelPage() {
  const [form, setForm] = useState({
    channelName: '',
    description: '',
    channelBanner: ''
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/channels', form);
      await dispatch(fetchMyChannel()).unwrap();
      navigate(`/channel/${res.data._id}`);
    } catch (err) {
      if (err.response?.status === 400) {
        alert('You already have a channel');
        navigate(`/channel/${err.response.data.channelId}`);
      } else {
        console.error(err);
        alert('Failed to create channel');
      }
    }
  };

  return (
    <>
      <Header />
      <div className="main-content create-channel-page">
        <h2 className="page-title">Create Your Channel</h2>
        <form className="channel-form" onSubmit={handleSubmit}>
          <input
            name="channelName"
            placeholder="Channel Name"
            value={form.channelName}
            onChange={handleChange}
            required
            className="channel-input"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="channel-textarea"
            rows={4}
          />
          <input
            name="channelBanner"
            placeholder="Banner URL (optional)"
            value={form.channelBanner}
            onChange={handleChange}
            className="channel-input"
          />
          <button type="submit" className="submit-button">Create</button>
        </form>
      </div>
    </>
  );
}