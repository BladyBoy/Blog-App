const { errorResponse } = require("./responseHandler");

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error("Error: ", err.message);

  // Set the default statusCode if none exists in the error
  const statusCode = err.statusCode || 500;

  // Call errorResponse from responseHandler
  return errorResponse(res, err.message || "Internal Server Error", statusCode);
};

module.exports = errorHandler;
