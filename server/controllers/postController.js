import asyncHandler from 'express-async-handler';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';

export const createPost = asyncHandler(async (req, res) => {
  const { content, tags } = req.body;
  const image = req.file ? req.file.path.replace(/\\/g, '/') : undefined;
  let post = await Post.create({
    author: req.user._id,
    content,
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    image
  });
  post = await post.populate('author', 'username fullName avatar');
  res.status(201).json({ success: true, data: post });
});

export const getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // تم إزالة الـ populate الخاص بالـ comments لمنع خطأ الـ 500
  const posts = await Post.find()
    .populate({
      path: 'author',
      select: 'fullName username avatar'
    })
    .populate('commentCount')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments();

  res.json({
    success: true,
    data: posts,
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
    totalPosts
  });
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'fullName username avatar');

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  res.json({ success: true, data: post });
});

export const updatePost = asyncHandler(async (req, res) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.author._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, data: post });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.author._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ success: true, data: {} });
});

export const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  
  const isLiked = post.likes.includes(req.user._id);
  if (isLiked) {
    post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
  } else {
    post.likes.push(req.user._id);
    if (post.author._id.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.author._id,
        sender: req.user._id,
        type: 'like',
        post: post._id
      });
    }
  }
  await post.save();
  res.json({ success: true, data: post });
});

export const getPostsByUser = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find({ author: req.params.userId })
    .populate('author', 'fullName username avatar')
    .populate('commentCount')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments({ author: req.params.userId });

  res.json({
    success: true,
    data: posts,
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
    totalPosts
  });
});