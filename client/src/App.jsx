import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const VideoPlayer = lazy(() => import('./pages/VideoPlayer.jsx'));
const ChannelPage = lazy(() => import('./pages/ChannelPage.jsx'));
const CreateChannelPage = lazy(() => import('./pages/CreateChannelPage.jsx'));
const UploadVideoPage = lazy(() => import('./pages/UploadVideoPage.jsx'));
const TrendingPage = lazy(() => import('./pages/TrendingPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));

export default function App() {
  const { userInfo } = useSelector(state => state.user);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading…</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/trending" element={<TrendingPage />} />

          {userInfo && (
            <>
              <Route path="/channel/create" element={<CreateChannelPage />} />
              <Route path="/channel/:id" element={<ChannelPage />} />
              <Route path="/channel/:id/upload" element={<UploadVideoPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </>
          )}

          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
