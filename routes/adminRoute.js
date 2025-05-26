const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlwares/userAuth");
const adminController = require("../controllers/adminController");

// Get all users
router.get("/users", userAuth, adminController.getAllUsers);

// Get single user by ID
router.get("/users/:id", userAuth, adminController.getUserById);

// Create a new user
router.post("/users", userAuth, adminController.createUserByAdmin);

// Update user data
router.put("/users/:id", userAuth, adminController.updateUserByAdmin);

// Assign or change role for a user
router.patch("/users/:id/role", userAuth, adminController.assignUserRole);

// Reset a user’s password
router.patch(
  "/users/:id/reset-password",
  userAuth,
  adminController.resetUserPassword
);

// Soft or hard delete user (use query param ?soft=true)
router.delete("/users/:id", userAuth, adminController.deleteUserByAdmin);

// Search users (query: ?name=&email=&role=)
router.get("/users/search", userAuth, adminController.searchUsers);

// Activate or deactivate a user
router.patch(
  "/users/:id/activate",
  userAuth,
  adminController.toggleUserActivation
);

module.exports = router;
