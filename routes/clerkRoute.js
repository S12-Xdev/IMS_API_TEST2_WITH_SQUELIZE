const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlwares/userAuth");
const {
  getItems,
  getItem,
  updateItem,
  assignItemToUser,
} = require("../controllers/clerkController");

router.post("/item/addItem", userAuth, addItem);

router.get("/item/getItems", userAuth, getItems);

router.get("/item/getItem/:id", userAuth, getItem);

router.put("/api/item/updateItem/:id", userAuth, updateItem);

router.post("/api/admin/assignItemToUser", userAuth, assignItemToUser);

module.exports = router;
