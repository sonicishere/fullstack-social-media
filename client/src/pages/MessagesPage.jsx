import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations, fetchMessages, setActiveConversation, createConversation } from '../features/messages/messageSlice';
import ConversationList from '../components/messages/ConversationList';
import ChatWindow from '../components/messages/ChatWindow';

const MessagesPage = () => {
  const dispatch = useDispatch();
  const { conversations, messages, activeConversation } = useSelector(state => state.messages);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const handleSelectConversation = (conv) => {
    dispatch(setActiveConversation(conv));
    dispatch(fetchMessages(conv._id));
  };

  const handleCreateConversation = async (recipient) => {
    if (recipient._id === user?._id) {
      return null;
    }

    try {
      const conversation = await dispatch(createConversation(recipient._id)).unwrap();
      dispatch(setActiveConversation(conversation));
      dispatch(fetchMessages(conversation._id));
      return conversation;
    } catch (err) {
      console.error('Failed to create conversation', err);
      return null;
    }
  };

  return (
    <div className="messages-layout">
      <ConversationList 
        conversations={conversations} 
        activeConversation={activeConversation} 
        onSelect={handleSelectConversation} 
        onCreateConversation={handleCreateConversation}
      />
      <ChatWindow 
        conversation={activeConversation} 
        messages={messages} 
      />
    </div>
  );
};

export default MessagesPage;
