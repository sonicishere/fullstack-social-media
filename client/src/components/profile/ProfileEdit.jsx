import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../features/users/userSlice';
import { getMe } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

const ProfileEdit = ({ profile, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    bio: profile?.bio || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarFrame, setAvatarFrame] = useState(profile?.avatarFrame || '');
  const dispatch = useDispatch();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (e.target.name === 'avatar') {
      setAvatarFile(file);
    } else if (e.target.name === 'coverImage') {
      setCoverFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('fullName', formData.fullName);
      payload.append('bio', formData.bio);
      payload.append('avatarFrame', avatarFrame);
      if (avatarFile) payload.append('avatar', avatarFile);
      if (coverFile) payload.append('coverImage', coverFile);

      await dispatch(updateProfile(payload)).unwrap();
      // refresh authenticated user so navbar/rightpanel reflect changes
      try { await dispatch(getMe()).unwrap(); } catch (e) { /* ignore */ }
      toast.success('Profile updated');
      onClose();
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '30px', background: 'var(--bg-primary)' }}>
        <h3 style={{ marginBottom: '20px' }}>Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)' }}>Full Name</label>
            <input type="text" name="fullName" className="auth-input" value={formData.fullName} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)' }}>Avatar</label>
            <input type="file" name="avatar" accept="image/*" onChange={handleFileChange} className="auth-input" />
            <div style={{ marginTop: '8px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)' }}>Avatar Frame</label>
              <select value={avatarFrame} onChange={(e) => setAvatarFrame(e.target.value)} className="auth-input">
                <option value="">None</option>
                <option value="gradient">Gradient Ring</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)' }}>Cover Image</label>
            <input type="file" name="coverImage" accept="image/*" onChange={handleFileChange} className="auth-input" />
          </div>
          <div className="mb-4">
            <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)' }}>Bio</label>
            <textarea name="bio" className="auth-input" value={formData.bio} onChange={handleChange} rows="4" style={{ resize: 'none' }}></textarea>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Cancel</button>
            <button type="submit" className="auth-btn" style={{ width: 'auto', padding: '10px 20px', marginTop: 0 }}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
