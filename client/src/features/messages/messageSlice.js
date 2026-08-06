import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messageApi } from '../../api/messageApi';

export const fetchConversations = createAsyncThunk('messages/fetchConversations', async (_, { rejectWithValue }) => {
  try {
    const response = await messageApi.getConversations();
    return response.data.data || response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch conversations');
  }
});

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async (conversationId, { rejectWithValue }) => {
  try {
    const response = await messageApi.getMessages(conversationId);
    return response.data.data || response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch messages');
  }
});

export const sendMessage = createAsyncThunk('messages/send', async (data, { rejectWithValue }) => {
  try {
    const response = await messageApi.sendMessage(data);
    return response.data.data || response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send message');
  }
});

export const createConversation = createAsyncThunk('messages/createConversation', async (userId, { rejectWithValue }) => {
  try {
    const response = await messageApi.createConversation(userId);
    return response.data.data || response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create conversation');
  }
});

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: [],
    messages: [],
    activeConversation: null,
    loading: false,
    error: null,
  },
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      // Update last message in conversation list
      const conv = state.conversations.find(c => c._id === action.payload.conversationId);
      if (conv) {
        conv.lastMessage = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => { state.loading = true; })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => { state.loading = true; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
        const conversationId = action.payload.conversationId || action.payload.conversation || action.payload.conversation?._id;
        const conv = state.conversations.find(c => c._id === conversationId);
        if (conv) {
          conv.lastMessage = action.payload;
        }
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        const exists = state.conversations.find(c => c._id === action.payload._id);
        if (!exists) {
          state.conversations.unshift(action.payload);
        }
        state.activeConversation = action.payload;
      });
  }
});

export const { setActiveConversation, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
