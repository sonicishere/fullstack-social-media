import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Avatar from '../common/Avatar';
import { timeAgo } from '../../utils/formatDate';
import { FiSearch, FiEdit, FiX } from 'react-icons/fi';
import { searchApi } from '../../api/searchApi';

const ConversationList = ({ conversations, activeConversation, onSelect, onCreateConversation }) => {
  const { user } = useSelector(state => state.auth);
  const [showNew, setShowNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setSearchLoading(true);
      try {
        const response = await searchApi.searchUsers(searchQuery.trim());
        if (mounted) {
          const users = response.data.data || response.data || [];
          setSearchResults(users.filter(foundUser => foundUser._id !== user?._id));
        }
      } catch (err) {
        if (mounted) {
          setSearchResults([]);
        }
      } finally {
        if (mounted) {
          setSearchLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchUsers, 350);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, user]);

  const handleSelectUser = async (selectedUser) => {
    const conversation = await onCreateConversation(selectedUser);
    if (conversation) {
      setSearchQuery('');
      setSearchResults([]);
      setShowNew(false);
    }
  };

  return (
    <div className="conversation-list glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontWeight: 700 }}>Messages</h4>
        <button style={{ color: 'var(--text-primary)', padding: '5px' }} onClick={() => setShowNew(!showNew)}>
          <FiEdit size={20} />
        </button>
      </div>
      
      {showNew ? (
        <div style={{ padding: '15px' }}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search users to message..."
              className="auth-input"
              style={{ paddingLeft: '40px', borderRadius: '20px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}>
                <FiX />
              </button>
            )}
          </div>

          <div style={{ marginTop: '15px' }}>
            {searchLoading && <p style={{ color: 'var(--text-secondary)' }}>Searching...</p>}
            {!searchLoading && searchResults.length === 0 && searchQuery.trim() && (
              <p style={{ color: 'var(--text-secondary)' }}>No users found.</p>
            )}
            {!searchLoading && searchResults.map((foundUser) => (
              <div
                key={foundUser._id}
                className="conversation-item"
                onClick={() => handleSelectUser(foundUser)}
                style={{ cursor: 'pointer' }}
              >
                <Avatar src={foundUser.avatar} size="md" />
                <div style={{ marginLeft: '12px', flexGrow: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {foundUser.fullName || 'User'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    @{foundUser.username}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: '15px' }}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Search conversations..." className="auth-input" style={{ paddingLeft: '40px', borderRadius: '20px' }} disabled />
          </div>
        </div>
      )}

      <div style={{ overflowY: 'auto', flexGrow: 1, padding: '0 10px 10px 10px' }}>
        {Array.isArray(conversations) && conversations.map(conv => {
          const otherUser = Array.isArray(conv.participants)
            ? conv.participants.find(p => p._id !== user?._id) || conv.participants[0] || {}
            : {};
          const isActive = activeConversation?._id === conv._id;

          return (
            <div 
              key={conv._id} 
              className={`conversation-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelect(conv)}
            >
              <Avatar src={otherUser.avatar} size="md" online={true} />
              <div style={{ marginLeft: '12px', flexGrow: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {otherUser.fullName || 'User'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {conv.lastMessage ? timeAgo(conv.lastMessage.createdAt) : ''}
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {conv.lastMessage?.content || 'Start a conversation'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
