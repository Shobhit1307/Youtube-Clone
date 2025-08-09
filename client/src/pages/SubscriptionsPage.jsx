import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient.js';
import Header from '../components/Header.jsx';
import VideoCard from '../components/VideoCard.jsx';

export default function SubscriptionsPage() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubs() {
      try {
        const res = await apiClient.get('/subscriptions');
        setChannels(res.data);
      } catch (err) {
        console.error('Failed to load subscriptions', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubs();
  }, []);

  return (
    <>
      <Header />
      <div className="app-body">
        <main className="main-content subscriptions-page">
          <h2 className="page-title">Your Subscriptions</h2>
          {loading ? <p className="loading">Loading…</p> : channels.length === 0 ? (
            <p className="no-videos">You have no subscriptions yet.</p>
          ) : (
            channels.map(ch => (
              <section key={ch._id} className="channel-section">
                {ch.channelBanner && (
                  <img
                    src={ch.channelBanner}
                    alt="banner"
                    className="channel-banner"
                  />
                )}
                <div className="channel-info">
                  <h3 className="channel-name">{ch.channelName}</h3>
                  <div className="subscribers-count">{ch.subscribersCount} subscribers</div>
                </div>
                <div className="video-grid">
                  {ch.videos && ch.videos.length > 0 ? (
                    ch.videos.map(v => <VideoCard key={v._id} video={v} />)
                  ) : (
                    <p className="no-videos">No recent videos</p>
                  )}
                </div>
              </section>
            ))
          )}
        </main>
      </div>
    </>
  );
}