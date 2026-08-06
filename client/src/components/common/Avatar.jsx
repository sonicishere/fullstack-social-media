import React from 'react';
import { DEFAULT_AVATAR, API_URL } from '../../utils/constants';

const getMediaUrl = (path) => {
  if (!path) return null;
  if (typeof path !== 'string') return null;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  // normalize backslashes and leading slashes
  const clean = path.replace(/\\/g, '/').replace(/^\/+/, '');
  const base = API_URL.replace('/api', '');
  return `${base}/${clean}`;
};

const Avatar = ({ src, alt, size = 'md', online, className = '', gradientRing = false }) => {
  const sizes = {
    sm: '32px',
    md: '40px',
    lg: '56px',
    xl: '120px'
  };

  const currentSize = sizes[size] || sizes.md;

  const containerStyle = {
    position: 'relative',
    display: 'inline-block',
    width: currentSize,
    height: currentSize
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: gradientRing ? 'none' : '1px solid var(--border-color)',
    background: 'var(--card-bg)'
  };

  return (
    <div style={containerStyle} className={className}>
      {gradientRing ? (
        <div className="profile-avatar-ring" style={{ width: '100%', height: '100%', padding: '3px' }}>
          <img src={getMediaUrl(src) || DEFAULT_AVATAR} alt={alt || 'Avatar'} style={imgStyle} />
        </div>
      ) : (
        <img src={getMediaUrl(src) || DEFAULT_AVATAR} alt={alt || 'Avatar'} style={imgStyle} />
      )}
      
      {online && (
        <span style={{
          position: 'absolute',
          bottom: '2px',
          right: '2px',
          width: '12px',
          height: '12px',
          backgroundColor: 'var(--success)',
          borderRadius: '50%',
          border: '2px solid var(--bg-primary)'
        }}></span>
      )}
    </div>
  );
};

export default Avatar;
