import express from 'express';
import { getProfile, updateProfile, followUser, unfollowUser, getFollowers, getFollowing, getSuggestedUsers, changePassword } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/suggested', protect, getSuggestedUsers);
// Allow public access to view a user's profile (no auth required)
router.get('/:id', getProfile);
router.put('/password', protect, changePassword);
router.put('/profile', protect, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), updateProfile);
router.put('/:id/follow', protect, followUser);
router.put('/:id/unfollow', protect, unfollowUser);
router.get('/:id/followers', protect, getFollowers);
router.get('/:id/following', protect, getFollowing);

export default router;
