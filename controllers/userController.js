const { CustomErrorHandler } = require("../utils/customErrorHandler");
const userService = require("../services/userService");

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 400));
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { token, user } = await userService.loginUser(req.body);
    res.status(200).json({ token, user });
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 401));
  }
};

// Get user by ID
exports.getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 404));
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    res
      .status(200)
      .json({ message: "User updated successfully", user: updated });
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 400));
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(
      req.params.id,
      currentPassword,
      newPassword
    );
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 400));
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 404));
  }
};

// Get all users (optionally with filter via query params)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req.query);
    res.status(200).json(users);
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 400));
  }
};
