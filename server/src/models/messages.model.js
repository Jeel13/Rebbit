const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    chatId: {
      type: mongoose.Types.ObjectId,
      ref: 'Chat',
    },
    content: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;
