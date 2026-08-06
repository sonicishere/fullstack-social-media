import React, { useState } from 'react';
import UserCard from '../profile/UserCard';
import PostCard from '../posts/PostCard';

const SearchResults = ({ users, posts, query }) => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '20px' }}>Search results for "{query}"</h3>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
        <button 
          onClick={() => setActiveTab('users')} 
          style={{ 
            color: activeTab === 'users' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'users' ? 600 : 400,
            borderBottom: activeTab === 'users' ? '2px solid var(--accent-primary)' : 'none',
            paddingBottom: '5px'
          }}
        >
          Users ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab('posts')} 
          style={{ 
            color: activeTab === 'posts' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'posts' ? 600 : 400,
            borderBottom: activeTab === 'posts' ? '2px solid var(--accent-primary)' : 'none',
            paddingBottom: '5px'
          }}
        >
          Posts ({posts.length})
        </button>
      </div>

      <div>
        {activeTab === 'users' && (
          <div>
            {users.length > 0 ? users.map(user => <UserCard key={user._id} user={user} />) : <p style={{ color: 'var(--text-secondary)' }}>No users found.</p>}
          </div>
        )}
        
        {activeTab === 'posts' && (
          <div>
            {posts.length > 0 ? posts.map(post => <PostCard key={post._id} post={post} />) : <p style={{ color: 'var(--text-secondary)' }}>No posts found.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
