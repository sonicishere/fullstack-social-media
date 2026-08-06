import express from 'express';
import { searchUsers, searchPosts } from '../controllers/searchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', protect, searchUsers);
router.get('/posts', protect, searchPosts);

export default router;
