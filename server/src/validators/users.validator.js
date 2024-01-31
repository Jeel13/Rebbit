const Joi = require('joi');

const registerUserSchema = Joi.object({
  body: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const loginUserSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const getUserSchema = Joi.object({
  params: Joi.object({
    username: Joi.string().required(),
  }),
});

const updateUserSchema = Joi.object({
  body: Joi.object({
    bio: Joi.string().required(),
    userId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
  getUserSchema,
  updateUserSchema,
};
