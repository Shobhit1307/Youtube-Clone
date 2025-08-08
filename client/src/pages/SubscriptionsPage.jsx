// src/pages/SubscriptionsPage.jsx
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
      
      <div className="app-body">
        {/* keep Sidebar if you want */}
        <main className="main-content">
          <h2>Your Subscriptions</h2>
          {loading ? <p>Loading…</p> : channels.length === 0 ? (
            <p>You have no subscriptions yet.</p>
          ) : (
            channels.map(ch => (
              <section key={ch._id} style={{ marginBottom: 24 }}>
                {ch.channelBanner && <img src={ch.channelBanner} alt="banner" style={{ width: '100%', borderRadius: 6, marginBottom: 8 }} />}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3>{ch.channelName}</h3>
                  <div>{ch.subscribersCount} subscribers</div>
                </div>

                <div style={{ marginTop: 8 }} className="video-grid">
                  {ch.videos && ch.videos.length > 0 ? (
                    ch.videos.map(v => <VideoCard key={v._id} video={v} />)
                  ) : (
                    <p>No recent videos</p>
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
