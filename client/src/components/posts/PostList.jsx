import React from 'react';
import PostCard from './PostCard';
import Loader from '../common/Loader';

const PostList = ({ posts, loading }) => {
  if (loading && posts.length === 0) {
    return (
      <div style={{ marginTop: '20px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card post-card" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader />
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <h4>No posts to show</h4>
        <p>Follow users or create a post to get started!</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
