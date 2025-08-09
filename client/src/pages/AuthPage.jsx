import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser, loginUser } from '../features/user/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
        toast.success('Logged in successfully');
      } else {
        await dispatch(registerUser(formData)).unwrap();
        toast.success('Registered successfully');
      }
      navigate('/');
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">{mode === 'login' ? 'Sign In' : 'Register'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="auth-input"
              />
              <input
                type="text"
                name="avatar"
                placeholder="Avatar URL (optional)"
                value={formData.avatar}
                onChange={handleChange}
                className="auth-input"
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
            className="auth-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="auth-input"
          />
          <button type="submit" className="auth-submit-button">
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="toggle-mode">
          {mode === 'login' ? "Don't have an account?" : 'Already a user?'}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="toggle-mode-button"
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}