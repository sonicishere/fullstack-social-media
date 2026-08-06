import express from 'express';
import { getConversations, createConversation, getMessages, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/conversations')
  .get(protect, getConversations)
  .post(protect, createConversation);

router.route('/:conversationId')
  .get(protect, getMessages);

router.route('/')
  .post(protect, upload.single('image'), sendMessage);

export default router;
