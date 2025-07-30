import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header.jsx';
import apiClient from '../api/apiClient.js';

export default function ProfilePage() {
  const { userInfo } = useSelector(state => state.user);
  const [avatar, setAvatar] = useState(userInfo?.avatar || '');

  const handleUpdate = async () => {
    try {
      await apiClient.put('/auth/profile', { avatar });
      window.location.reload();
    } catch (err) {
      console.error('Update avatar failed:', err);
    }
  };

  return (
    <>
      <Header />
      <div className="main-content profile-page">
        <h2>Your Profile</h2>
        <img
          src={avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
          alt="avatar"
          className="profile-avatar"
        />
        <p>Username: {userInfo.username}</p>
        <input
          type="text"
          value={avatar}
          onChange={e => setAvatar(e.target.value)}
          placeholder="Avatar URL"
        />
        <button onClick={handleUpdate}>Update Avatar</button>
      </div>
    </>
  );
}
