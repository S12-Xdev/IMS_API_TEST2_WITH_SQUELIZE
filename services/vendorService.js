// services/userService.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models"); // Sequelize model (or Mongoose, etc.)
const { sendEmail } = require("./notificationService"); // Optional
const { Op } = require("sequelize");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Register a new user
async function registerUser({ name, phone, email, password, role }) {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    phone,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  // Optionally send welcome or verification email
  await sendEmail(email, "Welcome!", "Thanks for registering!");

  // Optionally send welcome or verification sms
  await sendOTPSMS(newUser.phone, "Welcome to our service! Your account has been created.");

  return newUser;
}

// Login user and return JWT token
async function loginUser({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1d",
  });

  return { token, user };
}

// Get user by ID
async function getUserById(userId) {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
  if (!user) throw new Error("User not found");
  return user;
}

// Update user profile
async function updateUser(userId, updateData) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  await user.update(updateData);
  return user;
}

// Change user password
async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Incorrect current password");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
}

// Delete user (soft delete or hard delete)
async function deleteUser(userId) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  await user.destroy(); // or use user.update({ deletedAt: new Date() }) for soft delete
}

// List users with filters
async function getAllUsers(filter = {}) {
  const users = await User.findAll({
    where: filter,
    attributes: { exclude: ["password"] },
  });
  return users;
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
  changePassword,
  deleteUser,
  getAllUsers,
};
