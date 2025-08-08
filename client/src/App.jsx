// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';

const HomePage = React.lazy(() => import('./pages/HomePage.jsx'));
const VideoPlayer = React.lazy(() => import('./pages/VideoPlayer.jsx'));
const ChannelPage = React.lazy(() => import('./pages/ChannelPage.jsx'));
const CreateChannelPage = React.lazy(() => import('./pages/CreateChannelPage.jsx'));
const UploadVideoPage = React.lazy(() => import('./pages/UploadVideoPage.jsx'));
const TrendingPage = React.lazy(() => import('./pages/TrendingPage.jsx'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage.jsx'));
const AuthPage = React.lazy(() => import('./pages/AuthPage.jsx'));
const EditVideoPage = React.lazy(() => import('./pages/EditVideoPage.jsx'));
const SubscriptionsPage = React.lazy(() => import('./pages/SubscriptionsPage.jsx'));

function LayoutWrapper() {
  const location = useLocation();
  // hide header/sidebar on auth path
  const hideLayout = location.pathname === '/auth';
  // If you later want to hide multiple paths:
  // const hideLayout = ['/auth','/some-other'].some(p => location.pathname.startsWith(p));

  // Sidebar open state could be lifted to context or Redux if needed globally.
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <>
      {!hideLayout && <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />}
      <div className="app-body" style={{ display: 'flex' }}>
        {!hideLayout && sidebarOpen && <Sidebar />}
        <main className="main-content" style={{ flex: 1, padding: 16 }}>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default function App() {
  const { userInfo } = useSelector(state => state.user); // keep route availability same as before

  return (
    <BrowserRouter>
      <React.Suspense fallback={<div>Loading…</div>}>
        <Routes>
          {/* All routes that should use the main layout */}
          <Route element={<LayoutWrapper />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/trending" element={<TrendingPage />} />

            {/* Protected-ish routes (you previously gated by userInfo - keep that behaviour) */}
            {userInfo && (
              <>
                <Route path="/channel/create" element={<CreateChannelPage />} />
                <Route path="/channel/:id" element={<ChannelPage />} />
                <Route path="/channel/:id/upload" element={<UploadVideoPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/video/:id/edit" element={<EditVideoPage />} />
                <Route path="/subscriptions" element={<SubscriptionsPage />} />
              </>
            )}
          </Route>

          {/* Auth page - no header/sidebar */}
          <Route path="/auth" element={<AuthPage />} />

          {/* fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
