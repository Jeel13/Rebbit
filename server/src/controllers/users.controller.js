const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserModel = require('../models/users.model');
const { errorHandler } = require('../utils/errorHandler');
const {
  loginUserSchema,
  getUserSchema,
  updateUserSchema,
  registerUserSchema,
} = require('../validators/users.validator');

// @desc		Register a new user
// @route		POST /users/register
// @access	public
async function registerUser(req, res) {
  try {
    const validation = registerUserSchema.validate({ body: req.body });
    if (validation.error) throw validation.error;

    const { username, email, password } = req.body;

    const userExists = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      throw {
        name: 'ResourceError',
        message: 'User already exist',
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    return res.status(201).json({
      data: {
        userId: user._id,
        username: user.username,
        email: user.email,
        token: token,
      },
      message: 'User created successfully!',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

// @desc		Login to account
// @route		POST /users/login
// @access	public
async function loginUser(req, res) {
  try {
    const validation = loginUserSchema.validate({ body: req.body });
    if (validation.error) throw validation.error;

    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw {
        name: 'ResourceError',
        message: 'User not found',
      };
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw {
        name: 'ResourceError',
        message: 'Password Incorrect',
      };
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    return res.status(201).json({
      data: {
        userId: user._id,
        username: user.username,
        email: user.email,
        token: token,
      },
      message: 'User login successfully!',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

// @desc		Get info of a user
// @route		POST /users/:username
// @access	private
async function getUser(req, res) {
  try {
    const validation = getUserSchema.validate({ params: req.params });
    if (validation.error) throw validation.error;

    const username = req.params.username;
    const user = await UserModel.findOne({ username: username }).select(
      '-password'
    );

    if (!user) {
      throw {
        name: 'ResourceError',
        message: 'User not found',
      };
    }

    return res.status(200).json({
      data: user,
      message: 'User found successfully',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

// @desc		Update user info
// @route		PATCH /users/:id
// @access	private
async function updateUser(req, res) {
  try {
    const validation = updateUserSchema.validate({ body: req.body });
    if (validation.error) throw validation.error;

    const user = req.body;

    const userDoc = await UserModel.findById(user.userId).select('-password');

    if (!userDoc) {
      throw {
        name: 'ResourceError',
        message: 'User not found',
      };
    }

    userDoc.bio = user.bio;
    await userDoc.save();

    return res.status(200).json({
      data: userDoc,
      message: 'User Info updated successfully',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

// @desc		Get a set of random users
// @route		GET /users/random
// @access	public
async function getRandomUsers(req, res) {
  let { size } = req.query;

  try {
    const users = await UserModel.find().select('-password');

    if (size > users.length) {
      size = user.length;
    }

    const randomUsers = await UserModel.aggregate([
      { $sample: { size: parseInt(size) } },
      {
        $project: {
          password: 0,
        },
      },
    ]);

    return res.status(200).json({
      data: randomUsers,
      message: 'Users fetched successfully',
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  getRandomUsers,
};
