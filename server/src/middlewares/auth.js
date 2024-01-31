const jwt = require('jsonwebtoken');
const { errorHandler } = require('../utils/errorHandler');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

async function verifyToken(req, res, next) {
  try {
    const token = req.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      throw {
        name: 'AuthenticationError',
        message: 'Token not found',
      };
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    if (!objectIdRegex.test(userId)) {
      throw {
        name: 'AuthenticationError',
        message: 'Invalid userId',
      };
    }

    req.body = {
      ...req.body,
      userId,
    };

    return next();
  } catch (error) {
    errorHandler(error, res);
  }
}

async function optionallyVerifyToken(req, res, next) {
  try {
    const authorizationHeader = req.get('authorization');

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authorizationHeader.replace('Bearer ', '');

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    if (!objectIdRegex.test(userId)) {
      throw {
        name: 'AuthenticationError',
        message: 'Invalid userId',
      };
    }

    req.body = {
      ...req.body,
      userId,
    };

    return next();
  } catch (error) {
    errorHandler(error, res);
  }
}

module.exports = { verifyToken, optionallyVerifyToken };
