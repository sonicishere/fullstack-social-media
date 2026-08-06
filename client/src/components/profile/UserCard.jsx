import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';

const UserCard = ({ user }) => {
  return (
    <div className="user-card glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', marginBottom: '15px' }}>
      <Link to={`/profile/${user._id}`}>
        <Avatar src={user.avatar} size="md" />
      </Link>
      <div style={{ flexGrow: 1 }}>
        <Link to={`/profile/${user._id}`} style={{ color: 'var(--text-primary)', fontWeight: 600, display: 'block' }}>
          {user.fullName}
        </Link>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>@{user.username}</span>
      </div>
      <button className="auth-btn" style={{ width: 'auto', padding: '5px 15px', marginTop: 0, fontSize: '0.85rem' }}>Follow</button>
    </div>
  );
};

export default UserCard;
