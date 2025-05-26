const { CustomErrorHandler } = require("../utils/customErrorHandler");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { user } = require("../models"); // Sequelize model (or Mongoose, etc.)
const { sendEmail } = require("./notificationService"); // Optional
const { Op } = require("sequelize");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Register a new user
exports.registerUser = async ({ name, phone, email, password, role }) => {
  const existingUser = await user.findOne({ where: { email } });
  if (existingUser) throw new CustomErrorHandler("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await user.create({
    name,
    phone,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  // Optionally send welcome or verification email
  await sendEmail(email, "Welcome!", "Thanks for registering!");

  // Optionally send welcome or verification sms
  await sendOTPSMS(
    newUser.phone,
    "Welcome to our service! Your account has been created."
  );

  return newUser;
};

// Login user and return JWT token
exports.loginUser = async ({ email, password }) => {
  const user = await user.findOne({ where: { email } });
  if (!user) throw new CustomErrorHandler("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new CustomErrorHandler("Invalid credentials");

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1d",
  });

  return { token, user };
};

// Get user by ID
exports.getUserById = async (userId) => {
  const user = await user.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
  if (!user) throw new CustomErrorHandler("User not found");
  return user;
};

// Update user profile
exports.updateUser = async (userId, updateData) => {
  const User = await user.findByPk(userId);
  if (!User) throw new CustomErrorHandler("User not found");

  await User.update(updateData);
  return User;
};

// Change user password
exports.changePassword = async (userId, currentPassword, newPassword) => {
  const User = await user.findByPk(userId);
  if (!User) throw new CustomErrorHandler("User not found");

  const isMatch = await bcrypt.compare(currentPassword, User.password);
  if (!isMatch) throw new CustomErrorHandler("Incorrect current password");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  User.password = hashedPassword;
  await User.save();
};

// Delete user (soft delete or hard delete)
exports.deleteUser = async (userId) => {
  const User = await user.findByPk(userId);
  if (!User) throw new CustomErrorHandler("User not found");

  await User.destroy(); // or use User.update({ deletedAt: new Date() }) for soft delete
};

// List users with filters
exports.getAllUsers = async (filter = {}) => {
  const users = await user.findAll({
    where: filter,
    attributes: { exclude: ["password"] },
  });
  return users;
};
