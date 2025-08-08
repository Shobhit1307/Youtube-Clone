// src/pages/VideoPlayer.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import YouTube from "react-youtube";
import VideoJS from "../components/VideoJS.jsx";
import apiClient from "../api/apiClient.js";
import Header from "../components/Header.jsx";
import { toast } from "react-toastify";

export default function VideoPlayer() {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.user);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [mode, setMode] = useState("hidden");
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const fetchGuard = useRef(false);

  useEffect(() => {
    if (fetchGuard.current) return;
    fetchGuard.current = true;

    apiClient
      .get(`/videos/${id}`)
      .then((res) => {
        setVideo(res.data);
        // channel info
        const ch = res.data.channel;
        setSubscribersCount(ch?.subscribers?.length || 0);
        const uid = userInfo?._id;
        if (uid && ch?.subscribers) {
          setIsSubscribed(ch.subscribers.some(s => s._id ? s._id === uid : s === uid));
        } else {
          setIsSubscribed(false);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load video");
      });
  }, [id, userInfo]);

  if (!video)
    return (
      <>
        <Header />
        <div className="main-content">Loading…</div>
      </>
    );
  if (!video.videoUrl)
    return (
      <>
        <Header />
        <div className="main-content">
          <p style={{ color: "red" }}>⚠️ Invalid video URL</p>
        </div>
      </>
    );

  const isYT = video.videoUrl.includes("youtube.com/watch");
  const ytId = isYT ? new URL(video.videoUrl).searchParams.get("v") : null;

  async function toggleSubscribe() {
    if (!userInfo) {
      toast.info('Please login to subscribe');
      return;
    }
    try {
      const res = await apiClient.post(`/subscriptions/${video.channel._id}`);
      setIsSubscribed(res.data.subscribed);
      setSubscribersCount(res.data.subscribersCount);
    } catch (err) {
      console.error('subscribe error', err);
      toast.error('Failed to toggle subscription');
    }
  }

  return (
    <>
      
      <div className="main-content video-player">
        {isYT && ytId ? (
          <YouTube
            videoId={ytId}
            opts={{ width: "100%", playerVars: { autoplay: 1, controls: 1 } }}
          />
        ) : (
          <VideoJS
            options={{
              autoplay: true,
              controls: true,
              fluid: true,
              muted: true,
              sources: [{ src: video.videoUrl, type: "video/mp4" }],
            }}
            onReady={(player) => console.log("VideoJS ready")}
          />
        )}

        <h2>{video.title}</h2>
        <p>{video.description}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={video.channel?.channelBanner || video.uploader?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt="channel" style={{ width:48, height:48, borderRadius:6 }} />
            <div>
              <div style={{ fontWeight: 600 }}>{video.channel?.channelName || video.uploader?.username}</div>
              <div style={{ fontSize: 13, color: '#666' }}>{subscribersCount} subscribers</div>
            </div>
          </div>

          {/* Subscribe button (not shown to channel owner) */}
          {userInfo && userInfo._id !== String(video.channel?.owner?._id || video.channel?.owner) && (
            <button onClick={toggleSubscribe} style={{ marginLeft: 'auto', padding: '8px 12px', borderRadius: 4, border: '1px solid #cc0000', background: isSubscribed ? '#e0e0e0' : '#cc0000', color: isSubscribed ? '#333' : '#fff' }}>
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>

        <div style={{ marginTop: "1rem" }}>
          <button onClick={() => handleReaction('like')}>
            👍 {video.likes}
          </button>
          <button onClick={() => handleReaction('dislike')} style={{ marginLeft: "0.5rem" }}>
            👎 {video.dislikes}
          </button>
        </div>

        {/* Comments / rest of page unchanged */}
        <div style={{ marginTop: "1.5rem" }}>
          <button onClick={loadComments}>
            View Comments ({comments.length})
          </button>
          {userInfo && (
            <button onClick={() => setMode("add")} style={{ marginLeft: "1rem" }}>
              Add Comment
            </button>
          )}
        </div>

        {mode === "add" && userInfo && (
          <div style={{ marginTop: ".5rem" }}>
            <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={submitNew} disabled={!text.trim()} style={{ marginTop: ".5rem" }}>
              Submit
            </button>
          </div>
        )}

        {mode === "view" &&
          comments.map((c) => (
            <div key={c._id} style={{ marginTop: "1rem" }}>
              <strong>{c.user.username}</strong>:{" "}
              {editId === c._id ? (
                <>
                  <textarea rows={2} value={editText} onChange={(e) => setEditText(e.target.value)} />
                  <div>
                    <button onClick={submitEdit}>Save</button>
                    <button onClick={() => setEditId(null)} style={{ marginLeft: ".5rem" }}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <span>{c.text}</span>
              )}
              {userInfo?.id === c.user._id && editId !== c._id && (
                <div style={{ marginTop: "0.3rem" }}>
                  <button onClick={() => { setEditId(c._id); setEditText(c.text); }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(c._id)} style={{ marginLeft: ".5rem" }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );

  // helper functions (same as before)
  function handleReaction(type) {
    apiClient
      .post(`/videos/${id}/${type}`)
      .then((res) =>
        setVideo((v) => ({ ...v, likes: res.data.likes, dislikes: res.data.dislikes }))
      )
      .catch(() => toast.error(`Failed to ${type}`));
  }

  function loadComments() {
    apiClient
      .get(`/videos/${id}/comments`)
      .then((res) => {
        setComments(res.data);
        setMode("view");
      })
      .catch(() => toast.error("Failed to load comments"));
  }

  function submitNew() {
    apiClient
      .post(`/videos/${id}/comments`, { text })
      .then((res) => {
        setComments((c) => [res.data, ...c]);
        setText("");
        setMode("view");
      })
      .catch(() => toast.error("Failed to submit comment"));
  }

  function submitEdit() {
    apiClient
      .put(`/videos/${id}/comments/${editId}`, { text: editText })
      .then((res) => {
        setComments((c) => c.map((x) => (x._id === editId ? res.data : x)));
        setEditId(null);
        setEditText("");
      })
      .catch(() => toast.error("Failed to edit comment"));
  }

  function handleDelete(cid) {
    apiClient
      .delete(`/videos/${id}/comments/${cid}`)
      .then(() => setComments((c) => c.filter((x) => x._id !== cid)))
      .catch(() => toast.error("Failed to delete comment"));
  }
}
