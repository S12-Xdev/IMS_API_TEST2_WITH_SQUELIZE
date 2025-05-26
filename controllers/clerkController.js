const clerkService = require("../services/clerkService");
const { CustomErrorHandler } = require("../utils/customErrorHandler");

exports.addItem = async (req, res, next) => {
  try {
    const userData = req.user;
    if (!userData || (userData.role !== "admin" && userData.role !== "clerk")) {
      return next(new CustomErrorHandler("Unauthorized", 403));
    }

    const { itemName, catName, itemQuantity } = req.body;
    const newItem = await clerkService.addItem(itemName, catName, itemQuantity);

    res.status(201).json({ message: "Item added", data: newItem });
  } catch (error) {
    next(error);
  }
};

exports.getItems = async (req, res, next) => {
  try {
    const items = await clerkService.getAllItems();
    res.status(200).json({ Items: items });
  } catch (error) {
    next(error);
  }
};

exports.getItem = async (req, res, next) => {
  try {
    const userData = req.user;
    if (!userData || (userData.role !== "admin" && userData.role !== "user")) {
      return next(new CustomErrorHandler("Unauthorized", 403));
    }

    const foundItem = await clerkService.getItemById(req.params.id);
    res.status(200).json({ Item: foundItem });
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { itemName, itemQuantity } = req.body;
    const updatedItem = await clerkService.updateItem(
      req.params.id,
      itemName,
      itemQuantity
    );

    res.status(200).json({ message: "Item updated", data: updatedItem });
  } catch (error) {
    next(error);
  }
};

exports.assignItemToUser = async (req, res, next) => {
  try {
    const { itemId, userId, quantity } = req.body;
    const result = await clerkService.assignItemToUser(
      itemId,
      userId,
      quantity
    );

    res.status(201).json({
      message: result.message,
      assignedTo: `${result.user.fname} ${result.user.lname}`,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};
