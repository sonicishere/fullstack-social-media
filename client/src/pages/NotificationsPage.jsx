import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAllAsRead } from '../features/notifications/notificationSlice';
import NotificationItem from '../components/notifications/NotificationItem';
import Loader from '../components/common/Loader';

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector(state => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications(1));
  }, [dispatch]);

  const handleMarkAll = () => {
    dispatch(markAllAsRead());
  };

  if (loading && notifications.length === 0) {
    return <Loader fullPage={false} />;
  }

  return (
    <div className="glass-card" style={{ padding: '20px', minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontWeight: 700 }}>Notifications</h2>
        <button className="auth-btn" onClick={handleMarkAll} style={{ width: 'auto', padding: '8px 20px', marginTop: 0 }}>
          Mark all as read
        </button>
      </div>
      
      {notifications.length > 0 ? (
        notifications.map(notif => (
          <NotificationItem key={notif._id} notification={notif} />
        ))
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '50px' }}>
          <h4>No notifications yet</h4>
          <p>When someone interacts with you, it will show up here.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
