const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlwares/userAuth");
const { getItems, getItem } = require("../controllers/userController");

// This code defines a user route for fetching items and item details.

router.get("/item/getItems", userAuth, getItems);

router.get("/item/getItem/:id", userAuth, getItem);

module.exports = router;