import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Sidebar() {
  const { userInfo } = useSelector(state => state.user);

  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/trending">Trending</Link></li>
        <li><Link to="/subscriptions">Subscriptions</Link></li>
        {userInfo && <li><Link to={`/channel/${userInfo.id}`}>My Channel</Link></li>}
        {userInfo && <li><Link to="/channel/create">Create Channel</Link></li>}
        {userInfo && <li><Link to="/profile">Your Profile</Link></li>}
      </ul>
    </aside>
  );
}
