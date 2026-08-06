import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchResults from '../components/search/SearchResults';
import Loader from '../components/common/Loader';
import { searchApi } from '../api/searchApi';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const [usersRes, postsRes] = await Promise.all([
          searchApi.searchUsers(query),
          searchApi.searchPosts(query)
        ]);
        setUsers(usersRes.data.data || usersRes.data || []);
        setPosts(postsRes.data.data || postsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-secondary)' }}>
        <h2>Search</h2>
        <p>Type something in the search bar to find users and posts.</p>
      </div>
    );
  }

  if (loading) {
    return <Loader fullPage={false} />;
  }

  return <SearchResults users={users} posts={posts} query={query} />;
};

export default SearchPage;
