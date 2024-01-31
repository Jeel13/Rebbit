const mongoose = require('mongoose');
const mongodb = require('mongodb');

const PostModel = require('../models/posts.model');
const VoteModel = require('../models/votes.model');
const CommentModel = require('../models/comments.model');
const UserModel = require('../models/users.model');
const {
  createPostSchema,
  getPostsSchema,
  getUserPostsSchema,
  updatePostSchema,
  deletePostSchema,
  getVotedPostSchema,
  votePostSchema,
} = require('../validators/posts.validator');
const { errorHandler } = require('../utils/errorHandler');

// @desc		Create a new post
// @route		POST /posts/
// @access	private
async function createPost(req, res) {
  try {
    const validation = createPostSchema.validate({ body: req.body });
    if (validation.error) throw validation.error;

    const post = req.body;

    const newPost = await PostModel.create({
      author: post.userId,
      title: post.title,
      content: post.content,
    });

    return res.status(201).json({
      data: newPost,
      message: 'Post created successfully!',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

// @desc		Get one or more posts
// @route		GET /posts/
// @access	optional verification
async function getPosts(req, res) {
  try {
    const validation = getPostsSchema.validate({ query: req.query });
    if (validation.error) throw validation.error;

    const userId = req.body.userId;
    let { search, sortBy, currentPage, postId } = req.query;

    if (!sortBy) sortBy = '-createdAt';
    const sortOrder = sortBy.startsWith('-') ? -1 : 1;
    const sortField = sortBy.replace(/^-/, '');

    if (!currentPage) currentPage = 1;
    const pageSize = 10;

    let pipeline = [];

    if (search) {
      pipeline.push({
        $match: {
          title: { $regex: search, $options: 'i' },
        },
      });
    }

    if (postId) {
      pipeline.push({
        $match: {
          _id: new mongodb.ObjectId(postId),
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          [sortField]: sortOrder,
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
        $project: {
          authorInfo: 0,
        },
      },
      {
        $skip: (currentPage - 1) * pageSize,
      },
      {
        $limit: pageSize,
      }
    );

    const posts = await PostModel.aggregate(pipeline);
    if (posts.length == 0) {
      throw {
        name: 'ResourceError',
        message: 'Post not found',
      };
    }

    const postDoc = await Promise.all(
      posts.map(async (post) => {
        const vote = userId
          ? await VoteModel.findOne({ postId: post._id, userId })
          : null;

        const { upvoted, downvoted, saved } = vote || {
          upvoted: false,
          downvoted: false,
          saved: false,
        };

        return {
          ...post,
          upvoted,
          downvoted,
          saved,
        };
      })
    );

    return res.status(200).json({
      data: postDoc,
      message: 'Posts fetched successfully!',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

// @desc		Get post of a specific user
// @route		GET /posts/user
// @access	optional verification
async function getUserPosts(req, res) {
  try {
    const validation = getUserPostsSchema.validate({
      query: req.query,
    });
    if (validation.error) throw validation.error;

    const userId = req.body.userId;

    let { sortBy, currentPage, author } = req.query;

    if (!sortBy) sortBy = '-createdAt';
    const sortOrder = sortBy.startsWith('-') ? -1 : 1;
    const sortField = sortBy.replace(/^-/, '');

    if (!currentPage) currentPage = 1;
    const pageSize = 10;

    const user = await UserModel.findOne({ username: author }).select({
      _id: 1,
      username: 1,
    });
    if (!user) {
      throw {
        name: 'ResourceError',
        message: 'User not found',
      };
    }

    let posts = await PostModel.find({ author: user._id })
      .sort({
        [sortField]: sortOrder,
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    if (!posts) {
      throw {
        name: 'ResourceError',
        message: 'Post not found',
      };
    }

    const postDoc = await Promise.all(
      posts.map(async (post) => {
        const vote = userId
          ? await VoteModel.findOne({ postId: post._id, userId })
          : null;

        const { upvoted, downvoted, saved } = vote || {
          upvoted: false,
          downvoted: false,
          saved: false,
        };

        return {
          ...post._doc,
          upvoted,
          downvoted,
          saved,
          username: user.username,
        };
      })
    );

    return res.status(200).json({
      data: postDoc,
      message: 'Posts fetched successfully!',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

// @desc		Update a post
// @route		PATCH /posts/:id
// @access	private
async function updatePost(req, res) {
  try {
    const validation = updatePostSchema.validate({
      params: req.params,
      body: req.body,
    });
    if (validation.error) throw validation.error;

    const postId = req.params.id;
    const { userId, content } = req.body;
    const postDoc = await PostModel.findById(postId);

    if (!postDoc) {
      throw {
        name: 'ResourceError',
        message: 'Post not found',
      };
    }

    if (postDoc.author != userId) {
      throw {
        name: 'AuthenticationError',
        message: 'Not authorised to update',
      };
    }

    postDoc.content = content;
    postDoc.edited = true;

    await postDoc.save();

    return res.status(200).json({
      data: postDoc,
      message: 'Post updated successfully!',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

// @desc		Delete a post
// @route		DELETE /posts/:id
// @access	private
async function deletePost(req, res) {
  const mongoSession = await mongoose.startSession();
  try {
    const validation = deletePostSchema.validate({ params: req.params });
    if (validation.error) throw validation.error;

    const postId = req.params.id;
    const userId = req.body.userId;
    const postDoc = await PostModel.findById(postId);

    if (!postDoc) {
      throw {
        name: 'ResourceError',
        message: 'Post not found',
      };
    }

    if (postDoc.author != userId) {
      throw {
        name: 'AuthenticationError',
        message: 'Not authorised to update',
      };
    }

    mongoSession.startTransaction();

    await PostModel.deleteOne({ _id: postId }, { session: mongoSession });

    await CommentModel.deleteMany(
      {
        postId: postId,
      },
      { session: mongoSession }
    );

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    if (mongoSession.inTransaction()) await mongoSession.abortTransaction();
    mongoSession.endSession();
    errorHandler(error, res);
  }
}

// @desc		Upvote a post
// @route		POST /posts/upovte/:id
// @access	private
async function upvotePost(req, res) {
  const mongoSession = await mongoose.startSession();

  try {
    const validation = votePostSchema.validate({ params: req.params });
    if (validation.error) throw validation.error;

    const postId = req.params.id;
    const userId = req.body.userId;

    mongoSession.startTransaction();
    const post = await PostModel.findOne({ _id: postId });
    if (!post) {
      throw {
        name: 'ResourceError',
        message: 'Post not found',
      };
    }

    const vote = await VoteModel.findOne({ postId, userId });

    if (!vote) {
      await VoteModel.create(
        [
          {
            postId,
            userId,
            upvoted: true,
          },
        ],
        { session: mongoSession }
      );

      post.votes++;
    } else if (!vote.upvoted) {
      if (vote.downvoted) {
        vote.upvoted = true;
        vote.downvoted = false;
        await vote.save({ session: mongoSession });

        post.votes += 2;
      } else {
        vote.upvoted = true;
        await vote.save({ session: mongoSession });
        post.votes++;
      }
    } else {
      if (vote.saved) {
        vote.upvoted = false;
        await vote.save({ session: mongoSession });
      } else {
        await VoteModel.deleteOne(
          { postId, userId },
          { session: mongoSession }
        );
      }

      post.votes--;
    }

    await post.save({ session: mongoSession });

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    return res.status(200).json({ message: 'Post upvoted successfully' });
  } catch (error) {
    if (mongoSession.inTransaction()) await mongoSession.abortTransaction();
    mongoSession.endSession();
    errorHandler(error, res);
  }
}

// @desc		Downvote a post
// @route		POST /posts/downvote/:id
// @access	private
async function downvotePost(req, res) {
  const mongoSession = await mongoose.startSession();
  try {
    const validation = votePostSchema.validate({ params: req.params });
    if (validation.error) throw validation.error;

    const postId = req.params.id;
    const userId = req.body.userId;

    mongoSession.startTransaction();

    const post = await PostModel.findOne({ _id: postId });
    if (!post) {
      throw {
        name: 'ResourceError',
        message: 'Post not found',
      };
    }

    const vote = await VoteModel.findOne({ postId, userId });

    if (!vote) {
      await VoteModel.create(
        [
          {
            postId,
            userId,
            downvoted: true,
          },
        ],
        { session: mongoSession }
      );

      post.votes--;
    } else if (!vote.downvoted) {
      if (vote.upvoted) {
        vote.upvoted = false;
        vote.downvoted = true;
        await vote.save({ session: mongoSession });

        post.votes -= 2;
      } else {
        vote.downvoted = true;
        await vote.save({ session: mongoSession });

        post.votes--;
      }
    } else {
      if (vote.saved) {
        vote.downvoted = false;
        await vote.save({ session: mongoSession });
      } else {
        await VoteModel.deleteOne(
          { postId, userId },
          { session: mongoSession }
        );
      }
      post.votes++;
    }

    await post.save({ session: mongoSession });

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    return res.status(200).json({ message: 'Post downvoted successfully' });
  } catch (error) {
    if (mongoSession.inTransaction()) await mongoSession.abortTransaction();
    mongoSession.endSession();
    errorHandler(error, res);
  }
}

// @desc		Save a post
// @route		POST /posts/save/:id
// @access	private
async function savePost(req, res) {
  try {
    const validation = votePostSchema.validate({ params: req.params });
    if (validation.error) throw validation.error;

    const postId = req.params.id;
    const userId = req.body.userId;

    const post = await PostModel.findOne({ _id: postId });
    if (!post) {
      throw {
        name: 'ResourceError',
        message: 'Post not found',
      };
    }

    const vote = await VoteModel.findOne({ postId, userId });

    if (!vote) {
      await VoteModel.create([
        {
          postId,
          userId,
          saved: true,
        },
      ]);
    } else if (!vote.saved) {
      vote.saved = true;
      await vote.save();
    } else {
      if (vote.upvoted || vote.downvoted) {
        vote.saved = false;
        await vote.save();
      } else {
        await VoteModel.deleteOne({ postId, userId });
      }
    }

    return res.status(200).json({ message: 'Post saved successfully' });
  } catch (error) {
    errorHandler(error, res);
  }
}

// @desc		Get all the upvoted posts of a user
// @route		GET /posts/upvoted
// @access	optional verification
async function getUpvotedPost(req, res) {
  try {
    const validation = getVotedPostSchema.validate({
      query: req.query,
    });
    if (validation.error) throw validation.error;

    const userId = req.body.userId;

    let { sortBy, currentPage, author } = req.query;

    if (!sortBy) sortBy = '-createdAt';
    const sortOrder = sortBy.startsWith('-') ? -1 : 1;
    const sortField = sortBy.replace(/^-/, '');

    if (!currentPage) currentPage = 1;
    const pageSize = 10;

    const userDoc = await UserModel.findOne({ username: author });
    if (!userDoc) {
      throw {
        name: 'ResourceError',
        message: 'User not found',
      };
    }
    const userDocId = userDoc._id;

    const posts = await VoteModel.aggregate([
      {
        $match: {
          userId: new mongodb.ObjectId(userDocId),
          upvoted: true,
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'postId',
          foreignField: '_id',
          as: 'postInfo',
        },
      },
      {
        $unwind: {
          path: '$postInfo',
        },
      },
      {
        $replaceRoot: { newRoot: '$postInfo' },
      },
      {
        $sort: {
          [sortField]: sortOrder,
        },
      },
      {
        $skip: (currentPage - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
    ]);

    const postDoc = await Promise.all(
      posts.map(async (post) => {
        const vote = userId
          ? await VoteModel.findOne({ postId: post._id, userId })
          : null;

        const authorname = await UserModel.findOne({ _id: post.author });

        const { upvoted, downvoted, saved } = vote || {
          upvoted: false,
          downvoted: false,
          saved: false,
          username: authorname.username,
        };

        return {
          ...post,
          upvoted,
          downvoted,
          saved,
          username: authorname.username,
        };
      })
    );

    return res.status(200).json({
      data: postDoc,
      message: 'Posts fetched successfully!',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

// @desc		Get all the saved posts of a user
// @route		GET /posts/saved
// @access	optional verification
async function getSavedPost(req, res) {
  try {
    const validation = getVotedPostSchema.validate({
      query: req.query,
    });
    if (validation.error) throw validation.error;

    const userId = req.body.userId;

    let { sortBy, currentPage, author } = req.query;

    if (!sortBy) sortBy = '-createdAt';
    const sortOrder = sortBy.startsWith('-') ? -1 : 1;
    const sortField = sortBy.replace(/^-/, '');

    if (!currentPage) currentPage = 1;
    const pageSize = 10;

    const userDoc = await UserModel.findOne({ username: author });
    if (!userDoc) {
      throw {
        name: 'ResourceError',
        message: 'User not found',
      };
    }
    const userDocId = userDoc._id;

    const posts = await VoteModel.aggregate([
      {
        $match: {
          userId: new mongodb.ObjectId(userDocId),
          saved: true,
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'postId',
          foreignField: '_id',
          as: 'postInfo',
        },
      },
      {
        $unwind: {
          path: '$postInfo',
        },
      },
      {
        $replaceRoot: { newRoot: '$postInfo' },
      },
      {
        $sort: {
          [sortField]: sortOrder,
        },
      },
      {
        $skip: (currentPage - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
    ]);

    const postDoc = await Promise.all(
      posts.map(async (post) => {
        const vote = userId
          ? await VoteModel.findOne({ postId: post._id, userId })
          : null;

        const authorname = await UserModel.findOne({ _id: post.author });

        const { upvoted, downvoted, saved } = vote || {
          upvoted: false,
          downvoted: false,
          saved: false,
          username: authorname.username,
        };

        return {
          ...post,
          upvoted,
          downvoted,
          saved,
          username: authorname.username,
        };
      })
    );

    return res.status(200).json({
      data: postDoc,
      message: 'Posts fetched successfully!',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  upvotePost,
  downvotePost,
  savePost,
  getUpvotedPost,
  getSavedPost,
  getUserPosts,
};
