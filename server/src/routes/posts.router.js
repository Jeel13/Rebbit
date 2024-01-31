const express = require('express');

const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
  savePost,
  getUpvotedPost,
  getSavedPost,
  getUserPosts,
} = require('../controllers/posts.contoller');

const { verifyToken, optionallyVerifyToken } = require('../middlewares/auth');

const postsRouter = express.Router();

postsRouter.get('/', optionallyVerifyToken, getPosts);
postsRouter.post('/', verifyToken, createPost);
postsRouter.get('/user', optionallyVerifyToken, getUserPosts);
postsRouter.get('/upvoted', optionallyVerifyToken, getUpvotedPost);
postsRouter.post('/upvote/:id', verifyToken, upvotePost);
postsRouter.post('/downvote/:id', verifyToken, downvotePost);
postsRouter.get('/saved', optionallyVerifyToken, getSavedPost);
postsRouter.post('/save/:id', verifyToken, savePost);
postsRouter.patch('/:id', verifyToken, updatePost);
postsRouter.delete('/:id', verifyToken, deletePost);

module.exports = postsRouter;
