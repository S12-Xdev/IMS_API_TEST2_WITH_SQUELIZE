module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "fail";

  res.status(statusCode).json({
    status,
    message: err.message || "Something went wrong",
    // optional: include stack in development mode
    // stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
