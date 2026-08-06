import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, updateComment, removeComment, reactComment } from '../../features/posts/postSlice';
import { postApi } from '../../api/postApi';
import CommentItem from './CommentItem';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';

const CommentSection = ({ postId, comments = [] }) => {
  const [text, setText] = useState('');
  const [localComments, setLocalComments] = useState(comments);
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;

    const fetchComments = async () => {
      // If comments prop is provided and contains full comment objects, skip fetching.
      if (comments.length > 0 && typeof comments[0] === 'object' && (comments[0].content || comments[0].author)) {
        return;
      }
      setLoadingComments(true);
      try {
        const response = await postApi.getComments(postId);
        if (mounted) {
          const incoming = response.data.data || response.data || [];
          // ensure unique by _id
          const uniq = Array.isArray(incoming) ? Array.from(new Map(incoming.map(c => [c._id || c, c])).values()) : incoming;
          setLocalComments(uniq);
        }
      } catch (err) {
        console.error('Failed to load comments', err);
      } finally {
        if (mounted) {
          setLoadingComments(false);
        }
      }
    };

    fetchComments();
    return () => {
      mounted = false;
    };
  }, [comments, postId]);

  useEffect(() => {
    // normalize and dedupe incoming comments prop
    const incoming = comments || [];
    const uniq = Array.isArray(incoming) ? Array.from(new Map(incoming.map(c => [c._id || c, c])).values()) : incoming;
    setLocalComments(uniq);
  }, [comments]);

  const rootComments = localComments.filter(comment => !comment.parentComment);
  const repliesByParent = localComments.reduce((map, comment) => {
    const parentId = comment.parentComment?._id || comment.parentComment;
    if (parentId) {
      map[parentId] = map[parentId] || [];
      map[parentId].push(comment);
    }
    return map;
  }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      if (editingCommentId) {
        const updated = await dispatch(updateComment({ commentId: editingCommentId, content: text })).unwrap();
        setLocalComments(prev => prev.map(c => (c._id === updated._id ? updated : c)));
        setEditingCommentId(null);
        setEditingText('');
        setText('');
        toast.success('Comment updated');
      } else {
        const resultAction = await dispatch(addComment({ postId, content: text, parentComment: replyTo?._id || null })).unwrap();
        const newComment = resultAction.comment;
        setLocalComments(prev => {
          // avoid duplicates if parent also updates comments prop
          const exists = prev.some(c => (c._id || c) === (newComment._id || newComment));
          return exists ? prev : [...prev, newComment];
        });
        setText('');
        setReplyTo(null);
        toast.success('Comment added');
      }
    } catch (err) {
      toast.error(err || 'Failed to save comment');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (comment) => {
    setReplyTo(comment);
    setEditingCommentId(null);
    setEditingText('');
    setText(`@${comment.author?.username || ''} `);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setText('');
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.content);
    setText(comment.content);
    setReplyTo(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
    setText('');
  };

  const handleDelete = async (comment) => {
    try {
      await dispatch(removeComment(comment._id)).unwrap();
      setLocalComments(prev => prev.filter(c => c._id !== comment._id && (c.parentComment?._id || c.parentComment) !== comment._id));
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const handleReact = async (commentId) => {
    try {
      const updated = await dispatch(reactComment(commentId)).unwrap();
      setLocalComments(prev => prev.map(c => (c._id === updated._id ? updated : c)));
    } catch (err) {
      toast.error('Failed to react');
    }
  };

  return (
    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border-color)', animation: 'fadeIn 0.3s' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', maxHeight: '320px', overflowY: 'auto' }}>
        {loadingComments ? (
          <div style={{ color: 'var(--text-secondary)' }}>Loading comments...</div>
        ) : rootComments.length > 0 ? (
          rootComments.map(comment => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postId={postId}
              userId={user?._id}
              replies={repliesByParent[comment._id] || []}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReact={handleReact}
              isEditing={editingCommentId === comment._id}
              editText={editingText}
              onEditChange={(value) => setText(value)}
              onCancelEdit={handleCancelEdit}
            />
          ))
        ) : (
          <div style={{ color: 'var(--text-secondary)' }}>No comments yet. Be the first to comment.</div>
        )}
      </div>

      {replyTo && (
        <div style={{ marginBottom: '10px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Replying to @{replyTo.author?.username || 'user'}</span>
          <button type="button" onClick={handleCancelReply} style={{ border: 'none', background: 'transparent', color: 'var(--text-danger)', cursor: 'pointer' }}>Cancel</button>
        </div>
      )}

      {editingCommentId && (
        <div style={{ marginBottom: '10px', color: 'var(--accent-primary)' }}>Editing comment</div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <Avatar src={user?.avatar} size="sm" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={editingCommentId ? 'Edit comment...' : replyTo ? 'Write a reply...' : 'Write a comment...'}
          className="auth-input"
          style={{ padding: '8px 15px', flexGrow: 1 }}
        />
        <button type="submit" disabled={loading || !text.trim()} style={{ color: 'var(--accent-primary)', fontWeight: 600, padding: '0 15px' }}>
          {loading ? '...' : editingCommentId ? 'Save' : replyTo ? 'Reply' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
