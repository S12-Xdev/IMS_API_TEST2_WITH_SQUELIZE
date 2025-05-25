const { CustomErrorHandler } = require("../services/CustomErrorHandler");
const { item, category, user, previlege } = require("../models");

// Register a new user
exports.userRegister = async (req, res, next) => {
  const { userFname, userLname, userRole, userEmail, userPassword } = req.body;
  const userData = req.user;

  // Authorization check
  if (!userData || userData.role !== "admin") {
    return next(
      new CustomErrorHandler("You are not authorized to register users!", 403)
    );
  }

  // Basic validation
  if (!userFname || !userLname || !userRole || !userEmail || !userPassword) {
    return next(new CustomErrorHandler("All fields are required!", 400));
  }

  try {
    const existingUser = await user.findOne({ where: { email: userEmail } });
    if (existingUser) {
      throw new CustomErrorHandler("The user is already registered!", 409);
    }

    const role = await previlege.findOne({ where: { role: userRole } });
    if (!role) {
      throw new CustomErrorHandler("This role was not found", 404);
    }

    const newUser = await user.create({
      fname: userFname,
      lname: userLname,
      role_id: role.id,
      email: userEmail,
      password: userPassword, // Password should be hashed in production
    });

    res.status(201).json({
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// Add a new category
exports.addCategory = async (req, res, next) => {
  const { catName } = req.body;

  if (!catName) {
    return next(new CustomErrorHandler("Category name is required", 400));
  }

  try {
    const existingCat = await category.findOne({ where: { catName } });
    if (existingCat) {
      throw new CustomErrorHandler("Category is already registered", 409);
    }

    const newCategory = await category.create({ catName });

    res.status(201).json({
      message: "Category added successfully",
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

// Update an existing item
exports.updateItem = async (req, res, next) => {
  const { itemName, itemQuantity } = req.body;
  const itemId = req.params.id;

  if (!itemName || itemQuantity == null || itemQuantity < 0) {
    return next(new CustomErrorHandler("Invalid input for item update", 400));
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

// Delete an item
exports.deleteItem = async (req, res, next) => {
  const itemId = req.params.id;

  try {
    const itemExist = await item.findByPk(itemId);
    if (!itemExist) {
      throw new CustomErrorHandler("Item not found", 404);
    }

    await itemExist.destroy();

    res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
  const userData = req.user;

  // Authorization check
  if (!userData || userData.role !== "admin") {
    return next(
      new CustomErrorHandler("You are not authorized to view users!", 403)
    );
  }

  try {
    const usersList = await user.findAll({
      attributes: { exclude: ["password"] }, // Exclude password from response
    });

    if (usersList.length === 0) {
      throw new CustomErrorHandler("No users found", 404);
    }

    res.status(200).json({ Users: usersList });
  } catch (error) {
    next(error);
  }
};
