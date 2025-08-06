import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { store } from './app/store.js';
import App from './App.jsx';
import { fetchMyChannel } from './features/channel/channelSlice.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

function AppLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyChannel());
  }, [dispatch]);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* Preload channel data once at app startup */}
      <AppLoader />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        pauseOnHover
        closeOnClick
        draggable
        pauseOnFocusLoss
      />
    </Provider>
  </React.StrictMode>
);
