// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const VideoPlayer = lazy(() => import('./pages/VideoPlayer.jsx'));
const ChannelPage = lazy(() => import('./pages/ChannelPage.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/channel/:id" element={<ChannelPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
