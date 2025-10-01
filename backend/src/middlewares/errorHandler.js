import { CustomAPIError } from '../errors/index.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Kalau error custom
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      code: err.statusCode,
    });
  }

  // Tangani beberapa error umum (opsional)
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      status: "error",
      message: err.errors.map(e => e.message).join(", "),
      code: 400,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
      code: 401,
    });
  }

  // Fallback
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
    code: 500,
  });
};
