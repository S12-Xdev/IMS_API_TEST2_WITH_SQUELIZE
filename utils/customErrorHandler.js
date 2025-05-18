class CustomErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = (statusCode >= 400) & (statusCode < 500) ? "error" : "fail";

    this.isOprational = true; // This is an operational error, not a programming error
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace for debugging
  }

}

module.exports = CustomErrorHandler;