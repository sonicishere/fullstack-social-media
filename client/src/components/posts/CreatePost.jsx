import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiImage, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { createPost } from '../../features/posts/postSlice';
import Avatar from '../common/Avatar';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState('image');
  const fileInputRef = useRef(null);
  const { user } = useSelector(state => state.auth);
  const { loading } = useSelector(state => state.posts);
  const dispatch = useDispatch();

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Media must be less than 50MB');
        return;
      }
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
      setMediaPreview(null);
    }
    setMediaType('image');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !mediaFile) return;

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (mediaFile) {
        formData.append('image', mediaFile);
      }

      await dispatch(createPost(formData)).unwrap();
      setContent('');
      removeMedia();
      toast.success('Post created successfully!');
    } catch (err) {
      toast.error(err || 'Failed to create post');
    }
  };

  return (
    <div className="glass-card create-post-container">
      <form onSubmit={handleSubmit}>
        <div className="create-post-top">
          <Avatar src={user?.avatar} size="md" />
          <textarea
            className="create-post-input"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
          />
        </div>
        
        {mediaPreview && (
          <div className="create-post-preview">
            {mediaType === 'video' ? (
              <video src={mediaPreview} controls className="create-post-preview-img" />
            ) : (
              <img src={mediaPreview} alt="Preview" className="create-post-preview-img" />
            )}
            <button 
              type="button" 
              onClick={removeMedia}
              className="create-post-preview-remove"
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        <div className="create-post-bottom">
          <div className="create-post-actions-left">
            <label className="create-post-upload-label">
              <FiImage size={20} />
              <span>Photo / Video</span>
              <input 
                type="file" 
                hidden 
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime,video/x-matroska,video/ogg,video/avi" 
                onChange={handleMediaChange}
                ref={fileInputRef} 
              />
            </label>
          </div>
          <button 
            type="submit" 
            className="create-post-submit" 
            disabled={loading || (!content.trim() && !mediaFile)}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
