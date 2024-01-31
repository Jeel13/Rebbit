const express = require('express');
const {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  getRandomUsers,
} = require('../controllers/users.controller');

const { verifyToken, optionallyVerifyToken } = require('../middlewares/auth');

const usersRouter = express.Router();

usersRouter.post('/register', registerUser);
usersRouter.post('/login', loginUser);
usersRouter.get('/random', getRandomUsers);
usersRouter.get('/:username', optionallyVerifyToken, getUser);
usersRouter.patch('/:id', verifyToken, updateUser);

module.exports = usersRouter;
