import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Post from '../models/Post.js';

export const searchUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.q ? {
    $or: [
      { username: { $regex: req.query.q, $options: 'i' } },
      { fullName: { $regex: req.query.q, $options: 'i' } }
    ]
  } : {};

  const users = await User.find(keyword).limit(20).select('username fullName avatar');
  res.json({ success: true, data: users });
});

export const searchPosts = asyncHandler(async (req, res) => {
  const keyword = req.query.q ? {
    $or: [
      { content: { $regex: req.query.q, $options: 'i' } },
      { tags: { $regex: req.query.q, $options: 'i' } }
    ]
  } : {};

  const posts = await Post.find(keyword)
    .populate('author', 'username fullName avatar')
    .limit(20);
    
  res.json({ success: true, data: posts });
});
