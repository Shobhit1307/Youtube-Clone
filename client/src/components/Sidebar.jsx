// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
 

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/trending">Trending</Link></li>
        <li><Link to="/subscriptions">Subscriptions</Link></li>
        <li><Link to="/channel">My Channel</Link></li>
      </ul>
    </aside>
  );
}
