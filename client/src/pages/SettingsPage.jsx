import React, { useState } from 'react';
import ThemeToggle from '../components/common/ThemeToggle';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { updatePassword } from '../features/users/userSlice';

const SettingsPage = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '20px', fontWeight: 700 }}>Settings</h2>
      
      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '20px' }}>Account Settings</h4>
        <PasswordForm />
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '20px' }}>Appearance</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600 }}>Theme Preference</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Toggle between light and dark mode</div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '20px' }}>Privacy</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600 }}>Private Account</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Only followers can see your posts</div>
          </div>
          <input type="checkbox" style={{ transform: 'scale(1.5)', accentColor: 'var(--accent-primary)' }} />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

const PasswordForm = () => {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return toast.error('Please fill both fields');
    setLoading(true);
    try {
      await dispatch(updatePassword({ currentPassword, newPassword })).unwrap();
      toast.success('Password updated');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '5px' }}>Current Password</label>
        <input type="password" className="auth-input" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
      </div>
      <div>
        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '5px' }}>New Password</label>
        <input type="password" className="auth-input" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      </div>
      <button className="auth-btn" type="submit" style={{ width: 'auto', padding: '10px 20px', alignSelf: 'flex-start' }} disabled={loading}>
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
};
