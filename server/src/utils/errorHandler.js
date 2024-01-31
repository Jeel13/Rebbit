function errorHandler(error, res) {
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';

  if (error instanceof TypeError) {
    statusCode = 422; // Unprocessable Entity
    errorMessage = 'Type error in the request';
  } else if (error.name === 'AuthenticationError') {
    statusCode = 401;
    errorMessage = 'Authentication Failed';
  } else if (error.name === 'MongoError') {
    statusCode = 400; // Service Unavailable
    errorMessage = 'MongoDB error occurred';
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = 'Validation failed';
    // error.message = 'Provided data is invalid or empty';
  } else if (error.name === 'ResourceError') {
    statusCode = 404;
    errorMessage = 'Resource not found';
  }

  console.error(`Error name: ${error.name}`);
  console.error(`Error message: ${error.message}`);
  console.error(`Stack trace: ${error.stack}`);

  return res
    .status(statusCode)
    .json({ message: `${errorMessage}; ${error.message}` });
}

module.exports = { errorHandler };
