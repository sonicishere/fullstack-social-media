import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileEdit from '../components/profile/ProfileEdit';
import PostList from '../components/posts/PostList';
import Loader from '../components/common/Loader';
import { fetchProfile } from '../features/users/userSlice';
import { fetchPostsByUser } from '../features/posts/postSlice';

const ProfilePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profile, loading: userLoading } = useSelector(state => state.users);
  const { posts, loading: postsLoading } = useSelector(state => state.posts);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProfile(id));
      dispatch(fetchPostsByUser({ userId: id, page: 1 }));
    }
  }, [dispatch, id]);

  if (userLoading || !profile) {
    return <Loader fullPage={false} />;
  }

  return (
    <div>
      <ProfileHeader profile={profile} onEdit={() => setIsEditing(true)} />
      
      <div style={{ marginTop: '30px' }}>
        <h4 style={{ marginBottom: '20px', fontWeight: 600 }}>Posts</h4>
        <PostList posts={posts} loading={postsLoading} />
      </div>

      {isEditing && <ProfileEdit profile={profile} onClose={() => setIsEditing(false)} />}
    </div>
  );
};

export default ProfilePage;
