
const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success,
    message,
    data,
    code: statusCode
      });
};

const sendError = (res, statusCode, message, error = null) => {
  res.status(statusCode).json({ success: false, message, error });
};

export  { sendResponse, sendError };