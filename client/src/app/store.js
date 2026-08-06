import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postReducer from '../features/posts/postSlice';
import userReducer from '../features/users/userSlice';
import messageReducer from '../features/messages/messageSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import themeReducer from '../features/theme/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    users: userReducer,
    messages: messageReducer,
    notifications: notificationReducer,
    theme: themeReducer,
  },
});
