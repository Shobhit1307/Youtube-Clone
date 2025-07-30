import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser, loginUser } from '../features/user/userSlice.js';
import Header from '../components/Header.jsx';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    avatar: ''
  });

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await dispatch(loginUser(formData)).unwrap();
      } else {
        await dispatch(registerUser(formData)).unwrap();
      }
      navigate('/');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <>
      <Header />
      <div className="main-content auth-page">
        <h2>{mode === 'login' ? 'Sign In' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="avatar"
                placeholder="Avatar URL (optional)"
                value={formData.avatar}
                onChange={handleChange}
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
        </form>
        <p className="toggle-mode">
          {mode === 'login'
            ? "Don't have an account?"
            : 'Already a user?'}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </>
  );
}
