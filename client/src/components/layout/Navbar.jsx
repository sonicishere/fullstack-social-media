import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiMessageSquare, FiBell, FiMenu } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import ThemeToggle from '../common/ThemeToggle';
import Avatar from '../common/Avatar';
import SearchBar from '../search/SearchBar';
import { logoutUser } from '../../features/auth/authSlice';
import { fetchUnreadCount } from '../../features/notifications/notificationSlice';

const Navbar = () => {
  const { user } = useSelector(state => state.auth);
  const { unreadCount } = useSelector(state => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="glass-card" style={{
      position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '10px 20px', borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button className="d-md-none" style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>
          <FiMenu />
        </button>
        <Link to="/" className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          Connectify
        </Link>
      </div>

      <div className="d-none d-md-flex">
        <SearchBar />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <ThemeToggle />
        <Link to="/" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}><FiHome /></Link>
        <Link to="/messages" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}><FiMessageSquare /></Link>
        <Link to="/notifications" style={{ position: 'relative', color: 'var(--text-primary)', fontSize: '1.2rem' }}>
          <FiBell />
          {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
        </Link>
        
        <div className="dropdown">
          <div data-bs-toggle="dropdown" style={{ cursor: 'pointer' }}>
            <Avatar src={user?.avatar} alt={user?.username} size="sm" gradientRing={user?.avatarFrame === 'gradient'} />
          </div>
          <ul className="dropdown-menu dropdown-menu-end glass-card" style={{ padding: '10px', marginTop: '10px' }}>
            <li><Link className="dropdown-item" to={`/profile/${user?._id}`} style={{ color: 'var(--text-primary)' }}>Profile</Link></li>
            <li><Link className="dropdown-item" to="/settings" style={{ color: 'var(--text-primary)' }}>Settings</Link></li>
            <li><hr className="dropdown-divider" style={{ borderColor: 'var(--border-color)' }} /></li>
            <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
