import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo text-gradient">Connectify</div>
        <h3 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 600 }}>Welcome Back</h3>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
