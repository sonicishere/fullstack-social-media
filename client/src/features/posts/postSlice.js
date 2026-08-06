import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postApi } from '../../api/postApi';

export const fetchPosts = createAsyncThunk('posts/fetchAll', async (page, { rejectWithValue }) => {
  try {
    const response = await postApi.getPosts(page);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch posts');
  }
});

export const fetchPostById = createAsyncThunk('posts/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await postApi.getPostById(id);
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch post');
  }
});

export const createPost = createAsyncThunk('posts/create', async (data, { rejectWithValue }) => {
  try {
    const response = await postApi.createPost(data);
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create post');
  }
});

export const deletePost = createAsyncThunk('posts/delete', async (id, { rejectWithValue }) => {
  try {
    await postApi.deletePost(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete post');
  }
});

export const likePost = createAsyncThunk('posts/like', async (id, { rejectWithValue }) => {
  try {
    const response = await postApi.likePost(id);
    return { id, likes: response.data.data.likes };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to like post');
  }
});

export const addComment = createAsyncThunk('posts/comment', async ({ postId, content, parentComment }, { rejectWithValue }) => {
  try {
    const response = await postApi.addComment(postId, content, parentComment);
    return { postId, comment: response.data.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add comment');
  }
});

export const updateComment = createAsyncThunk('posts/updateComment', async ({ commentId, content }, { rejectWithValue }) => {
  try {
    const response = await postApi.updateComment(commentId, content);
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update comment');
  }
});

export const removeComment = createAsyncThunk('posts/removeComment', async (commentId, { rejectWithValue }) => {
  try {
    const response = await postApi.deleteComment(commentId);
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete comment');
  }
});

export const reactComment = createAsyncThunk('posts/reactComment', async (commentId, { rejectWithValue }) => {
  try {
    const response = await postApi.reactComment(commentId);
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to react to comment');
  }
});

export const fetchPostsByUser = createAsyncThunk('posts/fetchByUser', async ({ userId, page }, { rejectWithValue }) => {
  try {
    const response = await postApi.getPostsByUser(userId, page);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user posts');
  }
});

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    currentPost: null,
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    hasMore: true,
  },
  reducers: {
    resetPosts: (state) => {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.loading = true; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        const { data, currentPage, totalPages } = action.payload;
        if (currentPage === 1) {
          state.posts = data;
        } else {
          state.posts = [...state.posts, ...data];
        }
        state.page = currentPage;
        state.totalPages = totalPages;
        state.hasMore = currentPage < totalPages;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p._id !== action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.id);
        if (post) {
          post.likes = action.payload.likes;
        }
        if (state.currentPost && state.currentPost._id === action.payload.id) {
          state.currentPost.likes = action.payload.likes;
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.postId);
        if (post) {
          if (!post.comments) {
            post.comments = [];
          }
          post.comments.push(action.payload.comment);
          post.commentCount = (post.commentCount || post.comments.length || 0) + 1;
        }
        if (state.currentPost && state.currentPost._id === action.payload.postId) {
          if (!state.currentPost.comments) {
            state.currentPost.comments = [];
          }
          state.currentPost.comments.push(action.payload.comment);
          state.currentPost.commentCount = (state.currentPost.commentCount || state.currentPost.comments.length || 0) + 1;
        }
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const comment = action.payload;
        const targetPost = state.posts.find(p => p.comments?.some(c => c._id === comment._id || c === comment._id));
        if (targetPost && targetPost.comments) {
          targetPost.comments = targetPost.comments.map(c => {
            if (typeof c === 'string') return c === comment._id ? comment : c;
            return c._id === comment._id ? comment : c;
          });
        }
        if (state.currentPost && state.currentPost.comments) {
          state.currentPost.comments = state.currentPost.comments.map(c => {
            if (typeof c === 'string') return c === comment._id ? comment : c;
            return c._id === comment._id ? comment : c;
          });
        }
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        const { id, postId } = action.payload;
        const post = state.posts.find(p => p._id === postId);
        if (post && post.comments) {
          post.comments = post.comments.filter(c => c._id !== id && c !== id);
          post.commentCount = Math.max(0, (post.commentCount || post.comments.length) - 1);
        }
        if (state.currentPost && state.currentPost._id === postId && state.currentPost.comments) {
          state.currentPost.comments = state.currentPost.comments.filter(c => c._id !== id && c !== id);
          state.currentPost.commentCount = Math.max(0, (state.currentPost.commentCount || state.currentPost.comments.length) - 1);
        }
      })
      .addCase(reactComment.fulfilled, (state, action) => {
        const comment = action.payload;
        const targetPost = state.posts.find(p => p.comments?.some(c => c._id === comment._id || c === comment._id));
        if (targetPost && targetPost.comments) {
          targetPost.comments = targetPost.comments.map(c => {
            if (typeof c === 'string') return c === comment._id ? comment : c;
            return c._id === comment._id ? comment : c;
          });
        }
        if (state.currentPost && state.currentPost.comments) {
          state.currentPost.comments = state.currentPost.comments.map(c => {
            if (typeof c === 'string') return c === comment._id ? comment : c;
            return c._id === comment._id ? comment : c;
          });
        }
      })
      .addCase(fetchPostsByUser.pending, (state) => { state.loading = true; })
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        state.loading = false;
        const { data, currentPage, totalPages } = action.payload;
        state.posts = data;
        state.page = currentPage;
        state.totalPages = totalPages;
        state.hasMore = currentPage < totalPages;
      });
  }
});

export const { resetPosts, clearCurrentPost } = postSlice.actions;
export default postSlice.reducer;
