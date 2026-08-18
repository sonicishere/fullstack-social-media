import asyncHandler from 'express-async-handler';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import Notification from '../models/Notification.js';

const removeCommentAndReplies = async (commentId, postId) => {
  const replies = await Comment.find({ parentComment: commentId });
  for (const reply of replies) {
    await removeCommentAndReplies(reply._id, postId);
  }
  await Comment.findByIdAndDelete(commentId);
  await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } });
};

export const addComment = asyncHandler(async (req, res) => {
  const content = req.body.text || req.body.content;
  
  if (!content) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const parentComment = req.body.parentComment || null;
  if (parentComment) {
    const parent = await Comment.findById(parentComment);
    if (!parent || parent.post.toString() !== req.params.postId) {
      res.status(400);
      throw new Error('Invalid parent comment');
    }
  }

  let comment = await Comment.create({
    author: req.user._id,
    post: req.params.postId,
    parentComment,
    content
  });

  comment = await comment.populate('author', 'username fullName avatar');

  if (!post.comments) {
    post.comments = [];
  }
  post.comments.push(comment._id);
  await post.save();
  const postOwner = post.user || post.author;

  if (postOwner && postOwner.toString() !== req.user._id.toString()) {
    await Notification.create({
      recipient: postOwner,
      sender: req.user._id,
      type: 'comment',
      post: post._id,
      message: content
    });
  }

  res.status(201).json({ success: true, data: comment });
});

export const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('author', 'username fullName avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: comments });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }
  if (comment.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  await removeCommentAndReplies(comment._id, comment.post);
  res.json({ success: true, data: { id: comment._id, postId: comment.post } });
});

export const updateComment = asyncHandler(async (req, res) => {
  const content = req.body.text || req.body.content;
  if (!content) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }
  if (comment.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  comment.content = content;
  await comment.save();
  const populated = await comment.populate('author', 'username fullName avatar');
  res.json({ success: true, data: populated });
});

export const likeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }
  
  const isLiked = comment.likes.includes(req.user._id);
  if (isLiked) {
    comment.likes = comment.likes.filter(id => id.toString() !== req.user._id.toString());
  } else {
    comment.likes.push(req.user._id);
  }
  await comment.save();
  const populated = await comment.populate('author', 'username fullName avatar');
  res.json({ success: true, data: populated });
});
