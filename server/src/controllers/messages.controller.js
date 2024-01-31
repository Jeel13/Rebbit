const mongodb = require('mongodb');

const ChatModel = require('../models/chats.model');
const UserModel = require('../models/users.model');
const MessageModel = require('../models/messages.model');
const {
  getChatsSchema,
  sendMessageSchema,
  getMessagesSchema,
} = require('../validators/messages.validator');
const { errorHandler } = require('../utils/errorHandler');

// @desc		Get all the chats for one user
// @route		GET /messages/chats
// @access	private
async function getChats(req, res) {
  try {
    const validation = getChatsSchema.validate({ body: req.body });
    if (validation.error) throw validation.error;

    const userId = req.body.userId;
    let chats = await ChatModel.aggregate([
      {
        $match: {
          users: new mongodb.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'users',
          foreignField: '_id',
          as: 'recipients',
        },
      },
      {
        $project: {
          recipients: { _id: 1, username: 1, email: 1, bio: 1 },
          lastMessagedAt: 1,
          lastMessage: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);

    for (let i = 0; i < chats.length; i++) {
      const chat = chats[i];
      for (let j = 0; j < 2; j++) {
        if (chat.recipients[j]._id != userId) {
          chat.recipient = chat.recipients[j];
        }
      }
    }

    return res.status(201).json({
      data: chats,
      message: 'Chats fetched successfully!',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

// @desc		Send message to an existing chat or create a new one
// @route		POST /messages/send/id:receiverId
// @access	private
async function sendMessage(req, res) {
  try {
    const validation = sendMessageSchema.validate({
      params: req.params,
      body: req.body,
    });
    if (validation.error) throw validation.error;

    const receiverId = req.params.id;
    const { content, userId } = req.body;
    const receiver = await UserModel.findById(receiverId);

    if (!receiver) {
      throw {
        name: 'ResourceError',
        message: 'User not found',
      };
    }

    let chat = await ChatModel.findOne({
      users: {
        $all: [userId, receiverId],
      },
    });

    if (!chat) {
      chat = await ChatModel.create({
        users: [userId, receiverId],
      });
    }

    let newMessage = {
      sender: userId,
      content: content,
      chatId: chat._id,
    };

    var message = await MessageModel.create(newMessage);

    chat.latestMessage = message;
    chat.lastMessagedAt = Date.now();

    chat.save();

    return res.status(201).json({
      data: chat,
      message: 'Message sent successfully!',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

// @desc		Get all messages in a chat of a user
// @route		GET /messages/chat/id:chatId
// @access	private
async function getMessages(req, res) {
  try {
    const validation = getMessagesSchema.validate({ params: req.params });
    if (validation.error) throw validation.error;

    const chatId = req.params.id;
    const allMessages = await MessageModel.aggregate([
      {
        $match: {
          chatId: new mongodb.ObjectId(chatId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
        },
      },
      {
        $unwind: '$sender',
      },
      {
        $project: {
          'sender.password': 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 12,
      },
    ]);

    return res.status(201).json({
      data: allMessages,
      message: 'Message fetched successfully!',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

module.exports = {
  getChats,
  sendMessage,
  getMessages,
};
