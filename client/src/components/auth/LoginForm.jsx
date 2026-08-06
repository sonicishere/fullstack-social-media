import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { loginUser } from '../../features/auth/authSlice';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error('Please fill in all fields');
    }
    
    try {
      await dispatch(loginUser(formData)).unwrap();
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="auth-input-group">
        <FiMail className="auth-input-icon" />
        <input 
          type="email" 
          name="email" 
          placeholder="Email address" 
          className="auth-input" 
          value={formData.email} 
          onChange={handleChange} 
        />
      </div>

      <div className="auth-input-group">
        <FiLock className="auth-input-icon" />
        <input 
          type={showPassword ? 'text' : 'password'} 
          name="password" 
          placeholder="Password" 
          className="auth-input" 
          value={formData.password} 
          onChange={handleChange} 
        />
        <button 
          type="button" 
          onClick={() => setShowPassword(!showPassword)} 
          style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.9rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
          <input type="checkbox" /> Remember me
        </label>
        <Link to="/forgot-password" style={{ color: 'var(--accent-primary)' }}>Forgot password?</Link>
      </div>

      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>

      <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign up</Link>
      </p>
    </form>
  );
};

export default LoginForm;
