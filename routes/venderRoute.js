const express = require("express");
const router = express.Router();

const { userAuth } = require("../middlwares/userAuth");
const { CustomErrorHandler } = require("../services/CustomErrorHandler");

const { item, category, user, previlege } = require("../models");

router.put("/item/updateItem/:id", userAuth, async (req, res, next) => {
  const { itemName, itemQuantity } = req.body;
  const itemId = req.params.id;

  try {
    const itemExist = await item.findByPk(itemId);

    if (!itemExist) {
      throw new CustomErrorHandler("Item not found", 404);
    }

    // ✅ Use the instance to update
    await itemExist.update({
      item_name: itemName,
      quantity: itemQuantity,
    });

    res.status(200).json({
      message: "Item updated successfully",
      data: itemExist, // Already updated instance
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
