export const errorHandler = (err, req, res, next) => {

  console.error("🔴 SERVER ERROR:", err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};