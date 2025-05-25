const { CustomErrorHandler } = require("../services/CustomErrorHandler");
const { item, category, user, userItems } = require("../models");

exports.addItem = async (req, res, next) => {
  const { itemName, catName, itemQuantity } = req.body;
  const userData = req.user;

  if (!userData || (userData.role !== "admin" && userData.role !== "clerk")) {
    return next(
      new CustomErrorHandler("You are not authorized to add items!", 403)
    );
  }

  if (!itemName || !catName || itemQuantity == null || itemQuantity < 0) {
    return next(
      new CustomErrorHandler(
        "Invalid input: itemName, catName, and itemQuantity are required.",
        400
      )
    );
  }

  try {
    const cat = await category.findOne({ where: { catName } });
    if (!cat) {
      throw new CustomErrorHandler("Category not found", 404);
    }

    const itemExist = await item.findOne({ where: { item_name: itemName } });
    if (itemExist) {
      throw new CustomErrorHandler(
        "Item already registered. You can update the name or quantity.",
        409
      );
    }

    const newItem = await item.create({
      item_name: itemName,
      quantity: itemQuantity,
      category_id: cat.id,
    });

    res.status(201).json({
      message: "Item added successfully",
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
};

exports.getItems = async (req, res, next) => {
  try {
    const allItems = await item.findAll();
    res.status(200).json({ Items: allItems });
  } catch (error) {
    next(new CustomErrorHandler("Failed to retrieve items", 500));
  }
};

exports.getItem = async (req, res, next) => {
  const userData = req.user;

  if (!userData || (userData.role !== "admin" && userData.role !== "user")) {
    return next(
      new CustomErrorHandler("You are not authorized to view this item!", 403)
    );
  }

  try {
    const Item = await item.findByPk(req.params.id);
    if (!Item) {
      throw new CustomErrorHandler("Item not found", 404);
    }

    res.status(200).json({ Item });
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
  const { itemName, itemQuantity } = req.body;
  const itemId = req.params.id;

  if (!itemName || itemQuantity == null || itemQuantity < 0) {
    return next(
      new CustomErrorHandler(
        "Invalid input: itemName and itemQuantity are required.",
        400
      )
    );
  }

  try {
    const itemExist = await item.findByPk(itemId);
    if (!itemExist) {
      throw new CustomErrorHandler("Item not found", 404);
    }

    await itemExist.update({
      item_name: itemName,
      quantity: itemQuantity,
    });

    res.status(200).json({
      message: "Item updated successfully",
      data: itemExist,
    });
  } catch (error) {
    next(error);
  }
};

exports.assignItemToUser = async (req, res, next) => {
  const { itemId, userId, quantity } = req.body;

  if (!itemId || !userId || quantity == null || quantity <= 0) {
    return next(
      new CustomErrorHandler(
        "Invalid input: itemId, userId, and quantity are required.",
        400
      )
    );
  }

  try {
    const availableItem = await item.findByPk(itemId);
    if (!availableItem) {
      throw new CustomErrorHandler("Item not found!", 404);
    }

    if (availableItem.quantity < quantity) {
      throw new CustomErrorHandler("Not enough quantity available!", 409);
    }

    const newUserItem = await userItems.create({
      user_id: userId,
      item_id: itemId,
      quantity,
    });

    availableItem.quantity -= quantity;
    await availableItem.save();

    const userData = await user.findByPk(userId);

    res.status(201).json({
      message: `Item assigned to ${userData.fname} ${userData.lname} successfully`,
      data: newUserItem,
    });
  } catch (error) {
    next(error);
  }
};
