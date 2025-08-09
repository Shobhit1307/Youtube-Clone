import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const hideLayout = location.pathname === '/auth';
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <>
      {!hideLayout && <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />}
      <div className="app-body">
        {!hideLayout && sidebarOpen && <Sidebar />}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default function App() {
  const { userInfo } = useSelector(state => state.user);

  return (
    <BrowserRouter>
      <React.Suspense fallback={<div>Loading…</div>}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
          style={{ '--toastify-color-success': '#cc0000', '--toastify-color-error': '#cc0000' }}
        />
        <Routes>
          <Route element={<LayoutWrapper />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/trending" element={<TrendingPage />} />
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
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}