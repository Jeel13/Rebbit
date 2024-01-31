const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const { socketServer, authSocket } = require('./socketServer');

require('dotenv').config();

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'https://rebbit-web-app.onrender.com'],
  },
});

io.use(authSocket);
io.on('connection', (socket) => socketServer(socket));

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .then(() => {
    httpServer.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((error) => console.log(error));
