const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlwares/userAuth");
const {
  addItem,
  getItems,
  getItem,
  updateItem,
  assignItemToUser,
} = require("../controllers/clerkController");

// Add a new item
router.post("/items", userAuth, addItem);

// Get all items
router.get("/items", userAuth, getItems);

// Get a specific item by ID
router.get("/items/:id", userAuth, getItem);

// Update a specific item
router.put("/items/:id", userAuth, updateItem);

// Assign an item to a user
router.post("/items/assign", userAuth, assignItemToUser);

module.exports = router;
