const Joi = require('joi');

const createCommentSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    content: Joi.string().required(),
    parent: Joi.string().hex().length(24),
    userId: Joi.string().hex().length(24).required(),
  }),
});

const getPostCommentsSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
});

const updateCommentSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    content: Joi.string().required(),
    userId: Joi.string().hex().length(24).required(),
  }),
});

const deleteCommentSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  createCommentSchema,
  getPostCommentsSchema,
  updateCommentSchema,
  deleteCommentSchema,
};
