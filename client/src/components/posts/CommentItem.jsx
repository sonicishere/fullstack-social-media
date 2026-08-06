import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { timeAgo } from '../../utils/formatDate';
import { FiEdit, FiTrash2, FiCornerDownLeft, FiHeart, FiSend, FiX } from 'react-icons/fi';

const CommentItem = ({
  comment,
  userId,
  onReply,
  onEdit,
  onDelete,
  onReact,
  replies = [],
  isEditing,
  editText,
  onEditChange,
  onCancelEdit,
}) => {
  const author = comment.author || comment.user;
  const isOwn = userId === author?._id?.toString() || userId === (author?._id || author);
  const liked = Array.isArray(comment.likes) && comment.likes.some(id => id.toString() === userId?.toString());

  return (
    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link to={`/profile/${author?._id || author}`}>
          <Avatar src={author?.avatar} size="sm" />
        </Link>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 15px', borderRadius: '15px', flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
            <Link to={`/profile/${author?._id || author}`} style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>
              {author?.fullName || author?.username || 'User'}
            </Link>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{timeAgo(comment.createdAt || Date.now())}</span>
          </div>

          {isEditing ? (
            <div style={{ marginTop: '8px' }}>
              <input
                type="text"
                value={editText}
                onChange={(e) => onEditChange(e.target.value)}
                className="auth-input"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '12px', marginBottom: '10px' }}
              />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={onCancelEdit} style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <FiX /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '5px' }}>
              {comment.content || comment.text}
            </div>
          )}

          {!isEditing && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => onReply(comment)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiCornerDownLeft /> Reply
                </button>
                <button type="button" onClick={() => onReact(comment._id)} style={{ background: 'transparent', border: 'none', color: liked ? 'var(--danger)' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiHeart /> {comment.likes?.length || 0}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {isOwn && (
                  <>
                    <button type="button" onClick={() => onEdit(comment)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiEdit /> Edit
                    </button>
                    <button type="button" onClick={() => onDelete(comment)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiTrash2 /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {replies.length > 0 && (
        <div style={{ marginLeft: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {replies.map(reply => (
            <CommentItem
              key={reply._id}
              comment={reply}
              userId={userId}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onReact={onReact}
              replies={[]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
