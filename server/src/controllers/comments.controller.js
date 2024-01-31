const mongoose = require('mongoose');
const mongodb = require('mongodb');

const CommentModel = require('../models/comments.model');
const PostModel = require('../models/posts.model');
const UserModel = require('../models/users.model');
const {
  createCommentSchema,
  getPostCommentsSchema,
  updateCommentSchema,
  deleteCommentSchema,
} = require('../validators/comments.validator');
const { errorHandler } = require('../utils/errorHandler');

// @desc		Create a new comment
// @route		POST /comments/:id
// @access	private
async function createComment(req, res) {
  const mongoSession = await mongoose.startSession();
  try {
    const validation = createCommentSchema.validate({
      params: req.params,
      body: req.body,
    });
    if (validation.error) throw validation.error;

    const postId = req.params.id;
    const comment = req.body;

    const post = await PostModel.findById(postId);

    if (!post) {
      throw {
        name: 'ResourceError',
        message: 'Post not found',
      };
    }

    if (comment.parent) {
      const parentComment = await CommentModel.findById(comment.parent);

      if (!parentComment) {
        throw {
          name: 'ResourceError',
          message: 'Parent comment not found',
        };
      }
    }

    const user = await UserModel.findById(comment.userId).select({
      password: 0,
    });

    if (!user) {
      throw {
        name: 'ResourceError',
        message: 'User not found',
      };
    }

    mongoSession.startTransaction();

    const newComment = await CommentModel.create(
      [
        {
          author: comment.userId,
          content: comment.content,
          postId: postId,
          parent: comment.parent,
        },
      ],
      { session: mongoSession }
    );

    post.totalComments++;
    await post.save({ session: mongoSession });

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    const commentDoc = { ...newComment[0]._doc, username: user.username };

    return res.status(201).json({
      data: commentDoc,
      message: 'Comment created successfully',
    });
  } catch (error) {
    if (mongoSession.inTransaction()) await mongoSession.abortTransaction();
    mongoSession.endSession();
    errorHandler(error, res);
  }
}

// @desc		Get all comments of a post
// @route		GET /comments/post/:id
// @access	public
async function getPostComments(req, res) {
  try {
    const validation = getPostCommentsSchema.validate({ params: req.params });
    if (validation.error) throw validation.error;

    const postId = req.params.id;
    const commentDoc = await CommentModel.aggregate([
      {
        $match: {
          postId: new mongodb.ObjectId(postId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorInfo',
        },
      },
      {
        $unwind: {
          path: '$authorInfo',
        },
      },
      {
        $addFields: {
          username: '$authorInfo.username',
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          authorInfo: 0,
        },
      },
    ]);

    let commentParents = {};
    let rootComments = [];

    for (let i = 0; i < commentDoc.length; i++) {
      let comment = commentDoc[i];
      commentParents[comment._id] = comment;
    }

    for (let i = 0; i < commentDoc.length; i++) {
      const comment = commentDoc[i];
      if (comment.parent) {
        let commentParent = commentParents[comment.parent];
        commentParent.child = [...commentParent.child, comment];
      } else {
        rootComments = [...rootComments, comment];
      }
    }

    res.status(200).json({
      data: rootComments,
      message: 'Comments fetched successfully',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

// @desc		Update a post
// @route		PATCH /comments/:id
// @access	private
async function updateComment(req, res) {
  try {
    const validation = updateCommentSchema.validate({
      params: req.params,
      body: req.body,
    });
    if (validation.error) throw validation.error;

    const commentId = req.params.id;
    const { userId, content } = req.body;

    const commentDoc = await CommentModel.findById(commentId);

    if (!commentDoc) {
      throw {
        name: 'ResourceError',
        message: 'Comment not found',
      };
    }

    if (commentDoc.author != userId) {
      throw {
        name: 'AuthenticationError',
        message: 'Not authorised to update',
      };
    }

    commentDoc.content = content;
    commentDoc.edited = true;

    await commentDoc.save();

    return res.status(200).json({
      data: commentDoc,
      message: 'Comment updated successfully!',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

// @desc		Delete a post
// @route		DELETE /comments/:id
// @access	private
async function deleteComment(req, res) {
  const mongoSession = await mongoose.startSession();
  try {
    const validation = deleteCommentSchema.validate({ params: req.params });
    if (validation.error) throw validation.error;

    const commentId = req.params.id;
    const userId = req.body.userId;
    const commentDoc = await CommentModel.findById(commentId);

    if (!commentDoc) {
      throw {
        name: 'ResourceError',
        message: 'Comment not found',
      };
    }

    if (commentDoc.author != userId) {
      throw {
        name: 'AuthenticationError',
        message: 'Not authorised to update',
      };
    }

    mongoSession.startTransaction();

    const post = await PostModel.findById(commentDoc.postId);
    if (!post) {
      throw {
        name: 'ResourceError',
        message: 'Post not found',
      };
    }

    await deleteCommentTree(commentId, mongoSession);

    post.totalComments = (
      await CommentModel.find({ postId: post._id }).session(mongoSession)
    ).length;

    await post.save({ session: mongoSession });

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    if (mongoSession.inTransaction()) await mongoSession.abortTransaction();
    mongoSession.endSession();
    errorHandler(error, res);
  }
}

// @desc		Recursively deletes children of a comment
async function deleteCommentTree(commentId, mongoSession) {
  await CommentModel.deleteOne({ _id: commentId }, { session: mongoSession });

  const children = await CommentModel.find({ parent: commentId });

  for (const child of children) {
    await deleteCommentTree(child._id, mongoSession);
  }
}

module.exports = {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
};
