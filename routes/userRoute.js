const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { userAuth } = require("../middlwares/userAuth");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes
router.get("/:id", userAuth, userController.getUser);
router.put("/:id", userAuth, userController.updateUser);
router.put("/:id/change-password", userAuth, userController.changePassword);
router.delete("/:id", userAuth, userController.deleteUser);

// Admin/Clerk accessible route to get all users (you can protect this based on role inside the controller or middleware)
router.get("/", userAuth, userController.getAllUsers);

module.exports = router;
