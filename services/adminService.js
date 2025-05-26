const { CustomErrorHandler } = require("../utils/customErrorHandler");
const { sendEmail, sendOTPSMS } = require("./notificationService");

const { user } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// Get all users
const getAllUsers = async () => {
  return await user.findAll({
    attributes: { exclude: ["password"] },
    order: [["createdAt", "DESC"]],
  });
};

// Get a specific user by ID
exports.getUserById = async (userId) => {
  const User = await user.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
  if (!User) throw new CustomErrorHandler("User not found");
  return User;
};

// Create a new user (admin-level registration)
exports.createUserByAdmin = async ({ name, phone, email, password, role }) => {
  const existing = await user.findOne({ where: { email } });
  if (existing) throw new CustomErrorHandler("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await user.create({
    name,
    phone,
    email,
    password: hashedPassword,
    role,
  });

  // Optionally send welcome email
  await sendEmail(email, "Welcome!", "Your account has been created successfully.");
  // Optionally send welcome SMS
  await sendOTPSMS(
    phone,
    "Welcome to our service! Your account has been created."
  );

  return newUser;
};

// Update any user's data
exports.updateUserByAdmin = async (userId, updateData) => {
  const User = await user.findByPk(userId);
  if (!User) throw new CustomErrorHandler("User not found");

  await User.update(updateData);
  // Optionally send email notification
  if (updateData.email) {
    await sendEmail(
      updateData.email,
      "Profile Updated",
      "Your profile has been updated successfully."
    );
  }
  // Optionally send SMS notification
  if (updateData.phone) {
    await sendOTPSMS(
      updateData.phone,
      "Your profile has been updated successfully."
    );
  }
  return User;
};

// Assign or change role for any user
exports.assignUserRole = async (userId, newRole) => {
  const User = await user.findByPk(userId);
  if (!User) throw new CustomErrorHandler("User not found");

  User.role = newRole;
  await User.save();

  // Optionally send email notification
  await sendEmail(
    User.email,
    "Role Updated",
    `Your role has been changed to ${newRole}.`
  );
  // Optionally send SMS notification
  await sendOTPSMS(
    User.phone,
    `Your role has been changed to ${newRole}.`
  );

  return User;
};

// Reset user password
exports.resetUserPassword = async (userId, newPassword) => {
  const User = await user.findByPk(userId);
  if (!User) throw new CustomErrorHandler("User not found");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  User.password = hashedPassword;
  await User.save();
  // Optionally send email notification
  await sendEmail(
    User.email,
    "Password Reset",
    "Your password has been reset successfully."
  );
  // Optionally send SMS notification
  await sendOTPSMS(
    User.phone,
    "Your password has been reset successfully."
  );

  return { message: "Password reset successfully" };
};

// Soft delete or permanently delete user
exports.deleteUserByAdmin = async (userId, softDelete = false) => {
  const User = await user.findByPk(userId);
  if (!User) throw new CustomErrorHandler("User not found");

  if (softDelete) {
    await User.update({ deletedAt: new Date() });
  } else {
    await User.destroy();
  }

  return { message: "User deleted successfully" };
};

// Search users with filters
exports.searchUsers = async ({ name, email, role }) => {
  const condition = {};
  if (name) condition.name = { [Op.like]: `%${name}%` };
  if (email) condition.email = { [Op.like]: `%${email}%` };
  if (role) condition.role = role;

  return await user.findAll({
    where: condition,
    attributes: { exclude: ["password"] },
    order: [["createdAt", "DESC"]],
  });
};

// Toggle user activation status
exports.toggleUserActivation = async (userId, isActive) => {
  const User = await user.findByPk(userId);
  if (!User) throw new CustomErrorHandler("User not found");

  await User.update({ isActive });
  // Optionally send email notification
  await sendEmail(
    User.email,
    isActive ? "Account Activated" : "Account Deactivated",
    `Your account has been ${isActive ? "activated" : "deactivated"} successfully.`
  );
  // Optionally send SMS notification
  await sendOTPSMS(
    User.phone,
    `Your account has been ${isActive ? "activated" : "deactivated"} successfully.`
  );
  return {
    message: `User ${isActive ? "activated" : "deactivated"} successfully`,
  };
};
