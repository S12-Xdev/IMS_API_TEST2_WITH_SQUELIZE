const { CustomErrorHandler } = require("../services/CustomErrorHandler");
const { item, userItems } = require("../models");

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
    const foundItem = await item.findByPk(req.params.id);

    if (!foundItem) {
      throw new CustomErrorHandler("Item not found", 404);
    }

    res.status(200).json({ Item: foundItem });
  } catch (error) {
    next(
      error instanceof CustomErrorHandler
        ? error
        : new CustomErrorHandler("Error retrieving item", 500)
    );
  }
};

exports.getUserItems = async (req, res, next) => {
  const userData = req.user;

  if (!userData || userData.role !== "user") {
    return next(
      new CustomErrorHandler("You are not authorized to view your items!", 403)
    );
  }

  try {
    const userItemsList = await userItems.findAll({
      where: { user_id: userData.id },
      include: [{ model: item }],
    });

    if (userItemsList.length === 0) {
      throw new CustomErrorHandler("No items assigned to this user.", 404);
    }

    res.status(200).json({ UserItems: userItemsList });
  } catch (error) {
    next(
      error instanceof CustomErrorHandler
        ? error
        : new CustomErrorHandler("Failed to retrieve user items", 500)
    );
  }
};
