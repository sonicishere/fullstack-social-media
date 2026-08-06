import asyncHandler from 'express-async-handler';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate('participants', 'username fullName avatar')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
    
  res.json({ success: true, data: conversations });
});

export const createConversation = asyncHandler(async (req, res) => {
  const participantId = req.body.participantId || req.body.userId;
  if (!participantId || participantId.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Invalid conversation recipient');
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, participantId] }
  }).populate('participants', 'username fullName avatar');

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, participantId]
    });
    conversation = await Conversation.findById(conversation._id)
      .populate('participants', 'username fullName avatar');
  }

  res.status(201).json({ success: true, data: conversation });
});

export const getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation || !conversation.participants.includes(req.user._id)) {
    res.status(404);
    throw new Error('Conversation not found or not authorized');
  }

  const messages = await Message.find({ conversation: req.params.conversationId })
    .sort({ createdAt: 1 });
    
  res.json({ success: true, data: messages });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, content = '' } = req.body;
  const conversation = await Conversation.findById(conversationId);
  
  if (!conversation || !conversation.participants.includes(req.user._id)) {
    res.status(404);
    throw new Error('Conversation not found or not authorized');
  }

  const image = req.file ? req.file.path.replace(/\\/g, '/') : '';

  const message = await Message.create({
    conversation: conversationId,
    sender: req.user._id,
    content,
    image
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  const recipient = conversation.participants.find(p => p.toString() !== req.user._id.toString());
  
  await Notification.create({
    recipient,
    sender: req.user._id,
    type: 'message',
    message: content || 'Sent an image'
  });

  res.status(201).json({ success: true, data: message });
});
