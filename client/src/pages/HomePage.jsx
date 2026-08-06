import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreatePost from '../components/posts/CreatePost';
import PostList from '../components/posts/PostList';
import { fetchPosts } from '../features/posts/postSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const { posts, loading, page } = useSelector(state => state.posts);

  useEffect(() => {
    dispatch(fetchPosts(1));
  }, [dispatch]);

  return (
    <div>
      <h2 style={{ marginBottom: '20px', fontWeight: 700 }}>Home Feed</h2>
      <CreatePost />
      <PostList posts={posts} loading={loading && page === 1} />
    </div>
  );
};

export default HomePage;
