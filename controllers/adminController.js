const { CustomErrorHandler } = require("../utils/customErrorHandler");
const adminService = require("../services/adminService");

// GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 500));
  }
};

// GET /api/admin/users/:id
exports.getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 404));
  }
};

// POST /api/admin/users
exports.createUserByAdmin = async (req, res, next) => {
  try {
    const newUser = await adminService.createUserByAdmin(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 400));
  }
};

// PUT /api/admin/users/:id
exports.updateUserByAdmin = async (req, res, next) => {
  try {
    const updatedUser = await adminService.updateUserByAdmin(
      req.params.id,
      req.body
    );
    res.json(updatedUser);
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 400));
  }
};

// PATCH /api/admin/users/:id/role
exports.assignUserRole = async (req, res, next) => {
  try {
    const updatedUser = await adminService.assignUserRole(
      req.params.id,
      req.body.role
    );
    res.json(updatedUser);
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 400));
  }
};

// PATCH /api/admin/users/:id/reset-password
exports.resetUserPassword = async (req, res, next) => {
  try {
    const result = await adminService.resetUserPassword(
      req.params.id,
      req.body.newPassword
    );
    res.json(result);
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 400));
  }
};

// DELETE /api/admin/users/:id
exports.deleteUserByAdmin = async (req, res, next) => {
  try {
    const result = await adminService.deleteUserByAdmin(
      req.params.id,
      req.query.soft === "true"
    );
    res.json(result);
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 400));
  }
};

// GET /api/admin/users/search?name=...&email=...&role=...
exports.searchUsers = async (req, res, next) => {
  try {
    const users = await adminService.searchUsers(req.query);
    res.json(users);
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 400));
  }
};

// PATCH /api/admin/users/:id/activate
exports.toggleUserActivation = async (req, res, next) => {
  try {
    const result = await adminService.toggleUserActivation(
      req.params.id,
      req.body.isActive
    );
    res.json(result);
  } catch (err) {
    return next(new CustomErrorHandler(err.message, 400));
  }
};
