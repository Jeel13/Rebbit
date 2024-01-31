const express = require('express');

const {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
} = require('../controllers/comments.controller');

const { verifyToken } = require('../middlewares/auth');

const commentsRouter = express.Router();

commentsRouter.get('/post/:id', getPostComments);
commentsRouter.post('/:id', verifyToken, createComment);
commentsRouter.patch('/:id', verifyToken, updateComment);
commentsRouter.delete('/:id', verifyToken, deleteComment);

module.exports = commentsRouter;
