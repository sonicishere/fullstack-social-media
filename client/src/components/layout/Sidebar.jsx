import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUser, FiMessageSquare, FiBell, FiSettings } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import Avatar from '../common/Avatar';

const Sidebar = () => {
  const { user } = useSelector(state => state.auth);

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '12px 20px',
    borderRadius: 'var(--border-radius-sm)',
    color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
    background: isActive ? 'rgba(108, 92, 231, 0.1)' : 'transparent',
    marginBottom: '5px',
    fontWeight: isActive ? 600 : 400,
    transition: 'all 0.2s ease'
  });

  return (
    <div style={{ width: '250px', padding: '20px', position: 'sticky', top: '70px', height: 'calc(100vh - 70px)' }} className="d-none d-md-flex flex-column border-end border-color">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <Avatar src={user?.avatar} size="md" gradientRing={user?.avatarFrame === 'gradient'} />
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.fullName || 'User'}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>@{user?.username || 'username'}</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexGrow: 1 }}>
        <NavLink to="/" style={navLinkStyle}><FiHome size={20} /> Home</NavLink>
        <NavLink to={`/profile/${user?._id}`} style={navLinkStyle}><FiUser size={20} /> Profile</NavLink>
        <NavLink to="/messages" style={navLinkStyle}><FiMessageSquare size={20} /> Messages</NavLink>
        <NavLink to="/notifications" style={navLinkStyle}><FiBell size={20} /> Notifications</NavLink>
        <NavLink to="/settings" style={navLinkStyle}><FiSettings size={20} /> Settings</NavLink>
      </nav>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: 'auto' }}>
        &copy; {new Date().getFullYear()} Connectify
      </div>
    </div>
  );
};

export default Sidebar;
