import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiHeart, FiMessageCircle, FiShare2, FiTrash2 } from 'react-icons/fi';
import { likePost, deletePost } from '../../features/posts/postSlice';
import Avatar from '../common/Avatar';
import CommentSection from './CommentSection';
import { timeAgo } from '../../utils/formatDate';
import { API_URL } from '../../utils/constants';
import toast from 'react-hot-toast';

const BASE_URL = API_URL.replace('/api', '');

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('data:')) return imagePath;
  // Backend stores paths like "uploads/1234567890.jpg" (Windows may use backslashes)
  const cleanPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
  return `${BASE_URL}/${cleanPath}`;
};

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const postAuthor = post.author || post.user || {};
  const rawAuthorId = postAuthor._id || postAuthor || '';
  const authorId = rawAuthorId && rawAuthorId._id ? rawAuthorId._id : rawAuthorId;

  const currentUserId = user?._id ? String(user._id) : null;
  const isLiked = Array.isArray(post.likes) && currentUserId ? post.likes.some(id => String(id) === currentUserId) : false;

  // normalize media path
  const mediaPath = post.image && typeof post.image === 'string' ? post.image : null;
  const mediaUrl = mediaPath ? getImageUrl(mediaPath) : null;
  const mediaIsVideo = mediaPath ? /\.(mp4|mov|webm|ogg|mkv|avi)$/i.test(mediaPath) : false;

  const handleLike = () => {
    dispatch(likePost(post._id));
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await dispatch(deletePost(post._id)).unwrap();
        toast.success('Post deleted');
      } catch (err) {
        toast.error('Failed to delete post');
      }
    }
  };

  return (
    <div className="glass-card post-card">
      <div className="post-header">
        <Link to={`/profile/${authorId}`}>
          <Avatar src={postAuthor.avatar} size="md" />
        </Link>
        <div className="post-header-info">
          <Link to={`/profile/${authorId}`} style={{ color: 'var(--text-primary)' }}>
            <div className="post-author-name">{postAuthor.fullName || postAuthor.username || 'User'}</div>
          </Link>
          <div className="post-timestamp">
            {postAuthor.username && <span className="post-username">@{postAuthor.username} · </span>}
            {timeAgo(post.createdAt)}
          </div>
        </div>
        {user?._id === authorId && (
          <button onClick={handleDelete} className="post-delete-btn" title="Delete Post">
            <FiTrash2 size={16} />
          </button>
        )}
      </div>

      {post.content && (
        <div className="post-content">
          {post.content}
        </div>
      )}

      {mediaUrl && !imgError && (
        <div className="post-image-container">
          {mediaIsVideo ? (
            <video controls className="post-image" src={mediaUrl} onError={() => setImgError(true)} />
          ) : (
            <img 
              src={mediaUrl} 
              alt="Post" 
              className="post-image" 
              onError={() => setImgError(true)}
              loading="lazy"
            />
          )}
        </div>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map((tag, i) => (
            <span key={i} className="post-tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="post-actions">
        <button className={`action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
          <FiHeart fill={isLiked ? 'var(--danger)' : 'none'} />
          <span>{post.likes?.length || 0}</span>
        </button>
        
        <button className="action-btn" onClick={() => setShowComments(!showComments)}>
          <FiMessageCircle />
          <span>{post.commentCount ?? post.comments?.length ?? 0} Comment</span>
        </button>

        <button className="action-btn" onClick={() => {
          navigator.clipboard.writeText(window.location.origin + '/post/' + post._id);
          toast.success('Link copied!');
        }}>
          <FiShare2 />
          <span>Share</span>
        </button>
      </div>

      {showComments && <CommentSection postId={post._id} comments={post.comments} />}
    </div>
  );
};

export default PostCard;