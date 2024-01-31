const mongoose = require('mongoose');

const PostModel = require('./posts.model');
const UserModel = require('./users.model');

const voteSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: PostModel,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: UserModel,
  },
  upvoted: {
    type: Boolean,
    default: false,
  },
  downvoted: {
    type: Boolean,
    default: false,
  },
  saved: {
    type: Boolean,
    default: false,
  },
});

const VoteModel = mongoose.model('Vote', voteSchema);

module.exports = VoteModel;
