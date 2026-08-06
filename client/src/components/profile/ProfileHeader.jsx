import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiEdit2, FiUserPlus, FiUserCheck } from 'react-icons/fi';
import Avatar from '../common/Avatar';
import { API_URL } from '../../utils/constants';
import { followUser, unfollowUser } from '../../features/users/userSlice';

const ProfileHeader = ({ profile, onEdit }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // تحديد هل هذا هو بروفايل المستخدم الحالي أم لا
  const isOwnProfile = !profile || (user?._id === profile?._id);

  // دمج البيانات: لو بيانات البروفايل مش موجودة أو هي نفس بروفايلك، اعرض بيانات الـ auth user الأساسية
  const currentProfile = isOwnProfile ? { ...user, ...profile } : profile;

  const isFollowing = currentProfile?.followers?.includes(user?._id) || (currentProfile?.followers || []).some(f => f._id === user?._id);

  const handleFollowToggle = () => {
    if (isFollowing) {
      dispatch(unfollowUser(currentProfile._id));
    } else {
      dispatch(followUser(currentProfile._id));
    }
  };

  return (
    <div className="glass-card profile-header" style={{ position: 'relative', overflow: 'visible', marginBottom: '20px' }}>
      {/* صورة الغلاف */}
      <div className="profile-cover" style={{ height: '180px', backgroundImage: (function(){
          const p = currentProfile?.coverImage;
          if (!p || typeof p !== 'string') return 'var(--gradient-primary)';
          if (p.startsWith('http') || p.startsWith('data:')) return `url(${p})`;
          const base = API_URL.replace('/api', '');
          const clean = p.replace(/\\/g, '/').replace(/^\/+/, '');
          return `url(${base}/${clean})`;
        })(), backgroundSize: 'cover', backgroundPosition: 'center', borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit' }}>
      </div>
      
      {/* صورة البروفايل */}
      <div style={{ padding: '0 25px', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-50px', marginBottom: '15px' }}>
          <div style={{ background: 'var(--bg-card, #1e1e2f)', borderRadius: '50%', padding: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
          <Avatar src={currentProfile?.avatar} size="xl" gradientRing={currentProfile?.avatarFrame === 'gradient'} />
        </div>

        {/* أزرار التعديل أو المتابعة */}
        <div>
          {isOwnProfile ? (
            <button className="auth-btn" onClick={onEdit} style={{ width: 'auto', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <FiEdit2 /> Edit Profile
            </button>
          ) : (
            <button 
              className="auth-btn" 
              onClick={handleFollowToggle}
              style={{ width: 'auto', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px', background: isFollowing ? 'transparent' : 'var(--gradient-primary)', border: isFollowing ? '1px solid var(--accent-primary)' : 'none', cursor: 'pointer' }}
            >
              {isFollowing ? <><FiUserCheck /> Following</> : <><FiUserPlus /> Follow</>}
            </button>
          )}
        </div>
      </div>

      {/* معلومات المستخدم والبيو */}
      <div className="profile-info" style={{ padding: '0 25px' }}>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.8rem', color: 'var(--text-primary)' }}>
          {currentProfile?.fullName || user?.fullName || 'User'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', margin: '2px 0 10px 0', fontSize: '0.95rem' }}>
          @{currentProfile?.username || user?.username || 'username'}
        </p>
        
        <p style={{ margin: '12px 0', maxWidth: '600px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
          {currentProfile?.bio || 'No bio provided.'}
        </p>

        {/* إحصائيات البروفايل */}
        <div className="profile-stats" style={{ display: 'flex', gap: '20px', margin: '15px 0' }}>
          <div className="stat-item" style={{ display: 'flex', gap: '5px' }}>
            <span className="stat-value" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{currentProfile?.postCount || 0}</span>
            <span className="stat-label" style={{ color: 'var(--text-secondary)' }}>Posts</span>
          </div>
          <div className="stat-item" style={{ display: 'flex', gap: '5px' }}>
            <span className="stat-value" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{currentProfile?.followers?.length || 0}</span>
            <span className="stat-label" style={{ color: 'var(--text-secondary)' }}>Followers</span>
          </div>
          <div className="stat-item" style={{ display: 'flex', gap: '5px' }}>
            <span className="stat-value" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{currentProfile?.following?.length || 0}</span>
            <span className="stat-label" style={{ color: 'var(--text-secondary)' }}>Following</span>
          </div>
        </div>
      </div>

      {/* تاريخ الانضمام */}
      <div style={{ padding: '10px 25px 20px 25px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        Joined {new Date(currentProfile?.createdAt || Date.now()).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ProfileHeader;