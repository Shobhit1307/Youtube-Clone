// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const VideoPlayer = lazy(() => import('./pages/VideoPlayer.jsx'));
const ChannelPage = lazy(() => import('./pages/ChannelPage.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const TrendingPage = lazy(() => import('./pages/TrendingPage.jsx'));
const CreateChannelPage = lazy(() => import('./pages/CreateChannelPage.jsx'));
const UploadVideoPage = lazy(() => import('./pages/UploadVideoPage.jsx'));
// const EditVideoPage = lazy(() => import('./pages/EditVideoPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          
          <Route path="/trending" element={<TrendingPage />} />
          
          <Route path="/channel/create" element={<CreateChannelPage />} />
          <Route path="/channel/:id" element={<ChannelPage />} />
          <Route path="/channel/:id/upload" element={<UploadVideoPage />} />
          {/* <Route path="/channel/:channelId/edit/:id" element={<EditVideoPage />} /> */}
          
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
