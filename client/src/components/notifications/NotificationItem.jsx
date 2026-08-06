import React from 'react';
import { useDispatch } from 'react-redux';
import { FiHeart, FiMessageCircle, FiUserPlus } from 'react-icons/fi';
import Avatar from '../common/Avatar';
import { timeAgo } from '../../utils/formatDate';
import { markAsRead } from '../../features/notifications/notificationSlice';

const NotificationItem = ({ notification }) => {
  const dispatch = useDispatch();

  const getIcon = () => {
    switch(notification.type) {
      case 'like': return <FiHeart className="notification-icon like" />;
      case 'comment': return <FiMessageCircle className="notification-icon comment" />;
      case 'follow': return <FiUserPlus className="notification-icon follow" />;
      default: return <FiHeart className="notification-icon" />;
    }
  };

  const getActionText = () => {
    switch(notification.type) {
      case 'like': return 'liked your post';
      case 'comment': return 'commented on your post';
      case 'follow': return 'started following you';
      default: return 'interacted with you';
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      dispatch(markAsRead(notification._id));
    }
    // navigation logic would go here depending on notification.type
  };

  return (
    <div className={`notification-item ${!notification.read ? 'unread' : ''}`} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <Avatar src={notification.sender?.avatar} size="md" />
      <div style={{ marginLeft: '12px', flexGrow: 1 }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
          <span style={{ fontWeight: 600 }}>{notification.sender?.fullName}</span> {getActionText()}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginTop: '2px', display: 'flex', alignItems: 'center' }}>
          {getIcon()} {timeAgo(notification.createdAt)}
        </div>
      </div>
      {!notification.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', alignSelf: 'center' }} />}
    </div>
  );
};

export default NotificationItem;
