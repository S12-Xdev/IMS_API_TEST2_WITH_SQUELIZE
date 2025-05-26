const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const { user } = require("../models");
const { CustomErrorHandler } = require("../utils/customErrorHandler");

exports.auth = async (req, res, next) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return next(
      new CustomErrorHandler("Email and password are required!", 400)
    );
  }

  try {
    const userExist = await user.findOne({ where: { email: Email } });
    if (!userExist) {
      return next(
        new CustomErrorHandler("User not found. You can register.", 404)
      );
    }

    const isMatch = await bcrypt.compare(Password, userExist.password);
    if (!isMatch) {
      return next(new CustomErrorHandler("Your password is incorrect!", 403));
    }

    const token = jwt.sign(
      {
        id: userExist.id,
        email: userExist.email,
        role: userExist.role_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "2m" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: userExist.id,
        email: userExist.email,
        role_id: userExist.role_id,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful" });
};
