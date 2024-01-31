const Joi = require('joi');

const createPostSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    userId: Joi.string().hex().length(24).required(),
  }),
});

const getPostsSchema = Joi.object({
  query: Joi.object({
    search: Joi.string(),
    sortBy: Joi.string(),
    currentPage: Joi.number(),
    postId: Joi.string().hex().length(24),
  }),
});

const getUserPostsSchema = Joi.object({
  query: Joi.object({
    sortBy: Joi.string(),
    currentPage: Joi.number(),
    author: Joi.string().required(),
  }),
});

const updatePostSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    userId: Joi.string().hex().length(24).required(),
    content: Joi.string().required(),
  }),
});

const deletePostSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
});

const votePostSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
});

const getVotedPostSchema = Joi.object({
  query: Joi.object({
    sortBy: Joi.string(),
    currentPage: Joi.number(),
    author: Joi.string().required(),
  }),
});

module.exports = {
  createPostSchema,
  getPostsSchema,
  getUserPostsSchema,
  updatePostSchema,
  deletePostSchema,
  votePostSchema,
  getVotedPostSchema,
};
