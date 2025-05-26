const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const customErrorHandler = require("../utils/customErrorHandler");

dotenv.config();

exports.userAuth = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(
      new customErrorHandler("Access denied, no token provided!", 401)
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error.message); // Optional
    return next(new customErrorHandler("Invalid or expired token!", 401));
  }
};
