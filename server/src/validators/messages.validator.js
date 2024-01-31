const Joi = require('joi');

const getChatsSchema = Joi.object({
  body: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const sendMessageSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object({
    content: Joi.string().required(),
    direction: Joi.string(),
    userId: Joi.string().hex().length(24).required(),
  }),
});

const getMessagesSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  getChatsSchema,
  sendMessageSchema,
  getMessagesSchema,
};
