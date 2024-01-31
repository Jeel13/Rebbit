const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const {
  getChats,
  sendMessage,
  getMessages,
} = require('../controllers/messages.controller');

const messagesRouter = express.Router();

messagesRouter.get('/chats', verifyToken, getChats);
messagesRouter.post('/send/:id', verifyToken, sendMessage);
messagesRouter.get('/chat/:id', verifyToken, getMessages);

module.exports = messagesRouter;
