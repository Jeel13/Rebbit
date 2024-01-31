const jwt = require('jsonwebtoken');

let users = {};

const authSocket = (socket, next) => {
  let token = socket.handshake.auth.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.decoded = decoded;
      next();
    } catch (err) {
      console.log(err);
      next(new Error('Authentication error'));
    }
  } else {
    next(new Error('Authentication error'));
  }
};

const socketServer = (socket) => {
  const userId = socket.decoded.userId;

  if (!users[userId]) {
    users[userId] = [];
  }

  users[userId].push({ socketId: socket.id });

  socket.on('send-message', (recipientUserId, username, content) => {
    const recipientConnections = users[recipientUserId];

    if (recipientConnections) {
      recipientConnections.forEach((recipient) => {
        socket
          .to(recipient.socketId)
          .emit('receive-message', userId, username, content);
      });
    }
  });

  socket.on('disconnect', () => {
    if (users[userId]) {
      users[userId] = users[userId].filter(
        (userSocket) => userSocket.socketId !== socket.id
      );
    }
  });
};

module.exports = {
  authSocket,
  socketServer,
};
