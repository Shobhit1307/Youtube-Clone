// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Sidebar() {
  const { userInfo } = useSelector(state => state.user);
  const { myChannel } = useSelector(state => state.channel);

  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/trending">Trending</Link></li>
        <li><Link to="/subscriptions">Subscriptions</Link></li>

        {userInfo && (
          <>
            {myChannel ? (
              <>
                <li><Link to={`/channel/${myChannel._id}`}>My Channel</Link></li>
                <li><Link to={`/channel/${myChannel._id}/upload`}>Upload Video</Link></li>
              </>
            ) : (
              <li><Link to="/channel/create">Create Channel</Link></li>
            )}
            <li><Link to="/profile">Your Profile</Link></li>
          </>
        )}
      </ul>
    </aside>
  );
}
