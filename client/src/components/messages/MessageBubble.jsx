import React from 'react';
import { timeAgo } from '../../utils/formatDate';
import { API_URL } from '../../utils/constants';

const baseUrl = API_URL.replace('/api', '');

const getMessageImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
  return `${baseUrl}/${imagePath.replace(/^\/+/, '')}`;
};

const MessageBubble = ({ message, isOwn }) => {
  const imageUrl = getMessageImageUrl(message.image);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
      <div className={`message-bubble ${isOwn ? 'message-sender' : 'message-receiver'}`}>
        {message.content && <div style={{ marginBottom: message.image ? '10px' : 0 }}>{message.content}</div>}
        {imageUrl && <img src={imageUrl} alt="Sent" style={{ maxWidth: '220px', borderRadius: '14px', objectFit: 'cover' }} />}
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '5px', marginLeft: '5px', marginRight: '5px' }}>
        {timeAgo(message.createdAt || Date.now())}
      </div>
    </div>
  );
};

export default MessageBubble;
