// src/components/VideoJS.jsx
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function VideoJS({ options, onReady }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      const videoEl = document.createElement('video-js');
      videoEl.className = 'vjs-big-play-centered';
      videoRef.current.appendChild(videoEl);

      playerRef.current = videojs(videoEl, options, () => {
        videojs.log('player ready');
        onReady?.(playerRef.current);
      });
    } else if (playerRef.current) {
      playerRef.current.src(options.sources);
    }
  }, [options, onReady]);

  useEffect(() => () => {
    const player = playerRef.current;
    if (player && !player.isDisposed()) {
      player.dispose();
      playerRef.current = null;
    }
  }, []);

  return <div data-vjs-player><div ref={videoRef} /></div>;
}
