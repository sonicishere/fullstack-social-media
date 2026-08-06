import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-logo text-gradient">Connectify</div>
        <h3 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: 600 }}>Create an Account</h3>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
