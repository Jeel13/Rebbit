const mongoose = require('mongoose');

const PostModel = require('./posts.model');
const UserModel = require('./users.model');

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: UserModel,
    },
    content: {
      type: String,
      required: true,
      maxLength: [500],
    },
    postId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: PostModel,
    },
    votes: {
      type: Number,
      default: 0,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: 'Comment',
    },
    child: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model('Comment', commentSchema);

module.exports = CommentModel;
