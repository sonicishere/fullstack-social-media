import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Post from '../models/Post.js';
import mongoose from 'mongoose';

export const getProfile = asyncHandler(async (req, res) => {
  const query = mongoose.Types.ObjectId.isValid(req.params.id) 
    ? { _id: req.params.id }
    : { username: req.params.id };

  const user = await User.findOne(query).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const postCount = await Post.countDocuments({ author: user._id });

  res.json({ success: true, data: { ...user.toObject(), postCount } });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.fullName = req.body.fullName || user.fullName;
  user.bio = req.body.bio || user.bio;
  user.avatarFrame = req.body.avatarFrame || user.avatarFrame;

  if (req.files) {
    if (req.files.avatar && req.files.avatar[0]) {
      user.avatar = req.files.avatar[0].path;
    }
    if (req.files.coverImage && req.files.coverImage[0]) {
      user.coverImage = req.files.coverImage[0].path;
    }
  }

  await user.save();
  res.json({ success: true, data: user });
});

export const followUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    res.status(400);
    throw new Error('You cannot follow yourself');
  }

  const targetUser = await User.findById(req.params.id);
  if (!targetUser) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!req.user.following.includes(req.params.id)) {
    req.user.following.push(req.params.id);
    targetUser.followers.push(req.user._id);
    
    await req.user.save();
    await targetUser.save();

    await Notification.create({
      recipient: targetUser._id,
      sender: req.user._id,
      type: 'follow'
    });
  }

  res.json({ success: true, message: 'User followed successfully' });
});

export const unfollowUser = asyncHandler(async (req, res) => {
  const targetUser = await User.findById(req.params.id);
  if (!targetUser) {
    res.status(404);
    throw new Error('User not found');
  }

  req.user.following = req.user.following.filter(id => id.toString() !== req.params.id);
  targetUser.followers = targetUser.followers.filter(id => id.toString() !== req.user._id.toString());

  await req.user.save();
  await targetUser.save();

  res.json({ success: true, message: 'User unfollowed successfully' });
});

export const getFollowers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('followers', 'username fullName avatar');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, data: user.followers });
});

export const getFollowing = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('following', 'username fullName avatar');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, data: user.following });
});

export const getSuggestedUsers = asyncHandler(async (req, res) => {
  const users = await User.find({
    _id: { $ne: req.user._id, $nin: req.user.following }
  }).limit(5).select('username fullName avatar');
  
  res.json({ success: true, data: users });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Current and new passwords are required');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});
