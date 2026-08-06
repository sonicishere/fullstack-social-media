import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuggestedUsers, followUser } from '../../features/users/userSlice';
import Avatar from '../common/Avatar';
import { Link } from 'react-router-dom';

const RightPanel = () => {
  const dispatch = useDispatch();
  const { suggestedUsers } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchSuggestedUsers());
  }, [dispatch]);

  const handleFollow = (userId) => {
    dispatch(followUser(userId));
  };

  return (
    <div style={{ width: '300px', padding: '20px', position: 'sticky', top: '70px', height: 'calc(100vh - 70px)' }} className="d-none d-xl-block border-start border-color">
      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h5 style={{ marginBottom: '15px', fontSize: '1rem', fontWeight: 600 }}>Suggested for You</h5>
        {suggestedUsers && suggestedUsers.length > 0 ? (
          suggestedUsers.slice(0, 5).map(user => (
            <div key={user._id} className="user-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link to={`/profile/${user._id}`}>
                  <Avatar src={user.avatar} size="sm" />
                </Link>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Link to={`/profile/${user._id}`} style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                    {user.fullName}
                  </Link>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>@{user.username}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleFollow(user._id)}
                style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                Follow
              </button>
            </div>
          ))
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No suggestions right now.</p>
        )}
      </div>

      <div className="glass-card" style={{ padding: '20px' }}>
        <h5 style={{ marginBottom: '15px', fontSize: '1rem', fontWeight: 600 }}>Trending Tags</h5>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['#ReactJS', '#WebDev', '#Design', '#Glassmorphism', '#Connectify'].map(tag => (
            <span key={tag} style={{ 
              padding: '5px 10px', 
              borderRadius: '15px', 
              background: 'rgba(108, 92, 231, 0.1)', 
              color: 'var(--accent-primary)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
