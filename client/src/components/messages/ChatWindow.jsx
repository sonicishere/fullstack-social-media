import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSend, FiImage, FiSmile, FiX } from 'react-icons/fi';
import { sendMessage } from '../../features/messages/messageSlice';
import Avatar from '../common/Avatar';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ conversation, messages }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!conversation) {
    return (
      <div className="chat-window glass-card" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <FiSend size={50} style={{ marginBottom: '20px', opacity: 0.5 }} />
          <h3>Your Messages</h3>
          <p>Select a conversation or start a new one</p>
        </div>
      </div>
    );
  }

  const otherUser = Array.isArray(conversation.participants)
    ? conversation.participants.find(participant => {
        const participantId = participant?._id || participant;
        return participantId?.toString() !== user?._id?.toString();
      }) || conversation.participants[0] || {}
    : {};

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) return;
    try {
      const formData = new FormData();
      formData.append('conversationId', conversation._id);
      formData.append('content', text);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await dispatch(sendMessage(formData)).unwrap();
      setText('');
      setEmojiOpen(false);
      removeImage();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chat-window glass-card" style={{ height: '100%' }}>
      <div className="chat-header">
        <Avatar src={otherUser.avatar} size="md" online={true} />
        <div style={{ marginLeft: '15px' }}>
          <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{otherUser.fullName || 'User'}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--success)' }}>Online</div>
        </div>
      </div>

      <div className="message-list">
        {messages.map((msg, index) => (
          <MessageBubble key={msg._id || index} message={msg} isOwn={msg.sender === user._id} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {imagePreview && (
        <div className="chat-image-preview" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '12px', margin: '10px 15px' }}>
          <img src={imagePreview} alt="Preview" style={{ maxHeight: '120px', borderRadius: '10px', objectFit: 'cover' }} />
          <button type="button" onClick={removeImage} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}><FiX size={22} /></button>
        </div>
      )}

      <form className="chat-input-container" onSubmit={handleSend} style={{ position: 'relative' }}>
        <button type="button" onClick={() => setEmojiOpen(!emojiOpen)} style={{ color: 'var(--text-secondary)', padding: '10px' }}>
          <FiSmile size={24} />
        </button>
        <label htmlFor="message-image-upload" style={{ color: 'var(--text-secondary)', padding: '10px', cursor: 'pointer' }}>
          <FiImage size={24} />
          <input id="message-image-upload" type="file" accept="image/*" hidden onChange={handleImageChange} />
        </label>
        <input 
          type="text" 
          className="chat-input" 
          placeholder="Message..." 
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" style={{ color: 'var(--accent-primary)', padding: '10px' }} disabled={!text.trim() && !imageFile}>
          <FiSend size={24} />
        </button>

        {emojiOpen && (
          <div style={{ position: 'absolute', bottom: '60px', left: '10px', display: 'grid', gridTemplateColumns: 'repeat(6, minmax(32px, 1fr))', gap: '8px', padding: '10px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', zIndex: 20 }}>
            {['😀','😂','😍','🥰','😎','😢','👍','🙏','🔥','🎉','❤️','🤔'].map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setText(prev => prev + emoji);
                }}
                style={{ fontSize: '1.2rem', padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatWindow;
