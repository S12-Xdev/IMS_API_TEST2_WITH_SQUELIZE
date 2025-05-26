const { item, category, user, userItems } = require("../models");
const { CustomErrorHandler } = require("../utils/customErrorHandler");
const { sendEmail, sendOTPSMS } = require("./notificationService");

exports.addItem = async (itemName, catName, itemQuantity) => {
  if (!itemName || !catName || itemQuantity == null || itemQuantity < 0) {
    throw new CustomErrorHandler("Invalid input", 400);
  }

  const cat = await category.findOne({ where: { catName } });
  if (!cat) throw new CustomErrorHandler("Category not found", 404);

  const itemExist = await item.findOne({ where: { item_name: itemName } });
  if (itemExist) {
    throw new CustomErrorHandler("Item already exists", 409);
  }

  const newItem = await item.create({
    item_name: itemName,
    quantity: itemQuantity,
    category_id: cat.id,
  });

  return newItem;
};

exports.getAllItems = async () => {
  return await item.findAll();
};

exports.getItemById = async (itemId) => {
  const foundItem = await item.findByPk(itemId);
  if (!foundItem) throw new CustomErrorHandler("Item not found", 404);
  return foundItem;
};

exports.updateItem = async (itemId, itemName, itemQuantity) => {
  if (!itemName || itemQuantity == null || itemQuantity < 0) {
    throw new CustomErrorHandler("Invalid input", 400);
  }

  const foundItem = await item.findByPk(itemId);
  if (!foundItem) throw new CustomErrorHandler("Item not found", 404);

  await foundItem.update({
    item_name: itemName,
    quantity: itemQuantity,
  });

  return foundItem;
};

exports.assignItemToUser = async (itemId, userId, quantity) => {
  if (!itemId || !userId || quantity == null || quantity <= 0) {
    throw new CustomErrorHandler("Invalid input", 400);
  }

  const foundItem = await item.findByPk(itemId);
  if (!foundItem) throw new CustomErrorHandler("Item not found", 404);

  if (foundItem.quantity < quantity) {
    throw new CustomErrorHandler("Not enough quantity available", 409);
  }

  const userData = await user.findByPk(userId);
  if (!userData) throw new CustomErrorHandler("User not found", 404);

  const assignment = await userItems.create({
    user_id: userId,
    item_id: itemId,
    quantity,
  });

  foundItem.quantity -= quantity;
  await foundItem.save();

  const message = `Hello ${userData.fname} ${userData.lname},\nYou have been assigned ${quantity} of ${foundItem.item_name}.`;

  // Send email and SMS
  await sendEmail(userData.email, "Item Assigned", message);
  await sendOTPSMS(userData.phone, message);

  return {
    message: "Item assigned and notification sent",
    data: assignment,
    user: userData,
  };
};
