import express from 'express';
import { addComment, getComments, updateComment, deleteComment, likeComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/posts/:postId/comments')
  .post(protect, addComment)
  .get(protect, getComments);

router.route('/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

router.put('/:id/like', protect, likeComment);

export default router;
