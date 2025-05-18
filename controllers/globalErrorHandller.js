module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode;
  err.status = err.status;
  res.status(err.statusCode).json(err.message);
};
