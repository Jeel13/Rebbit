const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: mongoose.Types.ObjectId,
      ref: 'Message',
    },
    lastMessagedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const ChatModel = mongoose.model('Chat', chatSchema);

module.exports = ChatModel;
