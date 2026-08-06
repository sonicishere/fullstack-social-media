import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAllAsRead } from '../../features/notifications/notificationSlice';
import NotificationItem from './NotificationItem';

const NotificationPanel = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector(state => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications(1));
  }, [dispatch]);

  const handleMarkAll = () => {
    dispatch(markAllAsRead());
  };

  return (
    <div className="notification-panel glass-card dropdown-menu dropdown-menu-end show">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid var(--border-color)' }}>
        <h5 style={{ margin: 0, fontWeight: 600 }}>Notifications</h5>
        <button onClick={handleMarkAll} style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>Mark all read</button>
      </div>

      <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
        ) : notifications.length > 0 ? (
          notifications.map(notif => (
            <NotificationItem key={notif._id} notification={notif} />
          ))
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No new notifications
          </div>
        )}
      </div>
      
      <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
        <button style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>See all notifications</button>
      </div>
    </div>
  );
};

export default NotificationPanel;
