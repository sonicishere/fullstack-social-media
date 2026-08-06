import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../api/userApi';
import { createPost } from '../posts/postSlice';

export const fetchProfile = createAsyncThunk('users/fetchProfile', async (id, { rejectWithValue }) => {
  try {
    const response = await userApi.getProfile(id);
    return response.data.data || response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
  }
});

export const updateProfile = createAsyncThunk('users/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const response = await userApi.updateProfile(data);
    return response.data.data || response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
  }
});

export const updatePassword = createAsyncThunk('users/updatePassword', async (payload, { rejectWithValue }) => {
  try {
    const response = await userApi.updatePassword(payload);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update password');
  }
});

export const followUser = createAsyncThunk('users/follow', async (id, { rejectWithValue, getState }) => {
  try {
    const response = await userApi.followUser(id);
    const currentUserId = getState().auth.user?._id;
    return { ...response.data, currentUserId, profileId: id };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to follow user');
  }
});

export const unfollowUser = createAsyncThunk('users/unfollow', async (id, { rejectWithValue, getState }) => {
  try {
    const response = await userApi.unfollowUser(id);
    const currentUserId = getState().auth.user?._id;
    return { ...response.data, currentUserId, profileId: id };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to unfollow user');
  }
});

export const fetchSuggestedUsers = createAsyncThunk('users/suggested', async (_, { rejectWithValue }) => {
  try {
    const response = await userApi.getSuggestedUsers();
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch suggestions');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    profile: null,
    suggestedUsers: [],
    followers: [],
    following: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
        state.suggestedUsers = action.payload;
      })
      .addCase(followUser.fulfilled, (state, action) => {
         if (state.profile && state.profile._id === action.payload.profileId) {
             if (!state.profile.followers) {
               state.profile.followers = [];
             }
             if (!state.profile.followers.includes(action.payload.currentUserId)) {
               state.profile.followers.push(action.payload.currentUserId);
             }
         }
         state.suggestedUsers = state.suggestedUsers.filter(user => user._id !== action.payload.profileId);
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
         if (state.profile && state.profile._id === action.payload.profileId) {
             if (state.profile.followers) {
               state.profile.followers = state.profile.followers.filter(id => id !== action.payload.currentUserId);
             }
         }
      })
      .addCase(createPost.fulfilled, (state, action) => {
         if (state.profile && action.payload.author && state.profile._id === action.payload.author._id) {
           state.profile.postsCount = (state.profile.postsCount || 0) + 1;
         }
      });
  }
});

export default userSlice.reducer;
