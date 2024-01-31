const express = require('express');
const cors = require('cors');
const path = require('path');

const postsRouter = require('./routes/posts.router');
const commentsRouter = require('./routes/comments.router');
const usersRouter = require('./routes/users.router');
const messagesRouter = require('./routes/messages.router');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://rebbit-web-app.onrender.com'],
  })
);

app.use(express.json());
app.use(express.static(path.join(process.cwd(), '..', 'client', 'build')))

app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.get('/*', (req, res) => {
  res.sendFile(path.join(process.cwd(), '..', 'client', 'build', 'index.html'));

});

module.exports = app;
