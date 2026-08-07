import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { registerUser } from '../../features/auth/authSlice';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ fullName: '', username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return { label: '', color: 'transparent' };
    if (p.length < 6) return { label: 'Weak', color: 'var(--danger)' };
    if (p.length < 10) return { label: 'Medium', color: 'var(--warning)' };
    return { label: 'Strong', color: 'var(--success)' };
  };
  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    // فصل confirmPassword عن باقي البيانات عشان الـ Backend ما يعترضش
    const { confirmPassword, ...registerData } = formData;

    try {
      await dispatch(registerUser(registerData)).unwrap();
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      toast.error(err || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="auth-input-group">
        <FiUser className="auth-input-icon" />
        <input type="text" name="fullName" placeholder="Full Name" className="auth-input" value={formData.fullName} onChange={handleChange} required />
      </div>

      <div className="auth-input-group">
        <FiUser className="auth-input-icon" />
        <input type="text" name="username" placeholder="Username" className="auth-input" value={formData.username} onChange={handleChange} required />
      </div>

      <div className="auth-input-group">
        <FiMail className="auth-input-icon" />
        <input type="email" name="email" placeholder="Email address" className="auth-input" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="auth-input-group mb-1">
        <FiLock className="auth-input-icon" />
        <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" className="auth-input" value={formData.password} onChange={handleChange} required />
        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      
      {formData.password && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px', fontSize: '0.8rem', color: strength.color }}>
          {strength.label}
        </div>
      )}

      <div className="auth-input-group">
        <FiLock className="auth-input-icon" />
        <input type={showPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" className="auth-input" value={formData.confirmPassword} onChange={handleChange} required />
      </div>

      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>

      <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Log in</Link>
      </p>
    </form>
  );
};

export default RegisterForm;