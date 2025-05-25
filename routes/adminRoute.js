const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlwares/userAuth");

const {
  userRegister,
  addCategory,
  updateItem,
  deleteItem,
} = require("../controllers/adminController");

router.post("/registerUser", userAuth, userRegister);

router.post("/catagory/addCatagory", userAuth, addCategory);

router.put("/item/updateItem/:id", userAuth, updateItem);

router.delete("/item/deleteItem/:id", userAuth, deleteItem);

module.exports = router;
