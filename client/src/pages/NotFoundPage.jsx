import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      textAlign: 'center',
      background: 'var(--bg-primary)'
    }}>
      <h1 style={{ fontSize: '6rem', fontWeight: 700, margin: 0 }} className="text-gradient">404</h1>
      <h2 style={{ marginBottom: '20px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', maxWidth: '400px' }}>
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="auth-btn" style={{ width: 'auto', padding: '12px 30px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
        <FiHome /> Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
