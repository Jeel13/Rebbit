const mongoose = require('mongoose');
const UserModel = require('./users.model');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: UserModel,
    },
    title: {
      type: String,
      required: true,
      maxLength: [50],
    },
    content: {
      type: String,
      required: true,
      maxLength: [500],
    },
    votes: {
      type: Number,
      default: 0,
    },
    totalComments: {
      type: Number,
      default: 0,
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;
