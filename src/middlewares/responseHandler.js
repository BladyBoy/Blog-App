exports.successResponse = (res, message = "Success", data = null, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };
  
  exports.errorResponse = (res, message = "Something went wrong", statusCode = 500) => {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  };
  