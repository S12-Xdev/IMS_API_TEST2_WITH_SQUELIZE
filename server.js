"use strict";

const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// Sequelize and models
const db = require("./models");
const { item, category, user, previlege, userItems } = db;

// Custom error handler and utility
const globalErrorHandler = require("./controllers/globalErrorHandller");
const CustomErrorHandler = require("./utils/customErrorHandler");
const { where } = require("sequelize");
const { CatalogItem } = require("twilio/lib/rest/content/v1/content");

const app = express();
const port = process.env.PORT || 5000;

// ------------------- MIDDLEWARE -------------------

// Security headers
app.use(helmet());

// Parse cookies
app.use(cookieParser());

// Parse JSON and form data
app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend-domain.com",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// CORS headers for all responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Content-Type, access-control-allow-origin, x-api-applicationid, authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, PATCH, POST, DELETE"
  );
  next();
});

// Serve static files
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------- ROUTES -------------------

/**
 * @route POST /api/item/addItem
 * @desc Add a new item under a category
 */

app.get("/api/item/getItems", async (req, res) => {
  try {
    const allItems = await item.findAll();
    return res.status(200).json({ Items: allItems });
  } catch (error) {
    return res.status(500).json({ Error: error });
  }
});

app.get("/api/item/getItem/:id", async (req, res) => {
  try {
    const Item = await item.findByPk(req.params.id);
    if (!Item) {
      
      return res.status(404).json({ Error: "Item is not found" });
    }
    return res.status(200).json({ Items: Item });
  } catch (error) {
    return res.status(500).json({ Error: error });
  }
});

app.post("/api/item/addItem", async (req, res, next) => {
  const { itemName, catName, itemQuantity } = req.body;

  try {
    const cat = await category.findOne({ where: { catName } });

    if (!cat) {
      throw new CustomErrorHandler("Category not found", 404);
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
});

app.post("/api/catagory/addCatagory", async (req, res, next) => {
  const { catName } = req.body;

  try {
    const cat = await category.findOne({ where: { catName } });

    if (cat) {
      throw new CustomErrorHandler("Category is already registered", 404);
    }

    const newCatagory = await category.create({
      catName
    });

    res.status(201).json({
      message: "Catagory added successfully",
      Catagory: newCatagory,
    });
  } catch (error) {
    next(error);
  }
});

app.put("/api/item/updateItem/:id", async (req, res, next) => {
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

app.delete("/api/item/deleteItem/:id", async (req, res, next) => {
  const itemId = req.params.id;

  try {
    // Check if the item exists
    const itemExist = await item.findByPk(itemId);

    if (!itemExist) {
      throw new CustomErrorHandler("Item not found", 404);
    }

    // Optionally: If items are referenced in other tables (e.g., userItems), handle or prevent deletion
    // You can either use Sequelize associations to cascade or check references manually

    // Delete the item
    await itemExist.destroy();

    res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/registerUser", async (req, res, next) => {
  const { userFname, userLname, userRole, userEmail, userPassword } = req.body;

  try {
    const existingUser = await user.findOne({ where: { email: userEmail } });

    if (existingUser) {
      throw new CustomErrorHandler("The user is already registered!", 409);
    }

    const role = await previlege.findOne({ where: { role: userRole } });

    if (!role) {
      throw new CustomErrorHandler("This role not found", 404);
    }

    const newUser = await user.create({
      fname: userFname,
      lname: userLname,
      role_id: role.id,
      email: userEmail,
      password: userPassword, // You should hash this in production
    });

    res.status(201).json({
      message: "User is registered successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/assignItemToUser", async (req, res, next) => {
  const { itemId, userId, quantity } = req.body;

  try {
    // Check if the item exists and get its quantity
    const availableItem = await item.findByPk(itemId);

    if (!availableItem) {
      throw new CustomErrorHandler("Item not found!", 404);
    }

    if (availableItem.quantity < quantity) {
      throw new CustomErrorHandler(
        "There is not enough quantity available!",
        409
      );
    }

    // Assign item to user
    const newUserItem = await userItems.create({
      user_id: userId,
      item_id: itemId,
      quantity,
    });

    // Reduce the item stock
    availableItem.quantity -= quantity;
    await availableItem.save();

    // Fetch the user for confirmation message
    const userData = await user.findByPk(userId);

    res.status(201).json({
      message: `Item assigned to ${userData.fname} ${userData.lname} successfully`,
      data: newUserItem,
    });
  } catch (error) {
    next(error);
  }
});

// ------------------- ERROR HANDLING -------------------

// 404 fallback
app.all("*", (req, res, next) => {
  next(new CustomErrorHandler("This page is not found", 404));
});

// Global error handler
app.use(globalErrorHandler);

// ------------------- SERVER INIT -------------------

const startServer = async () => {
  try {
    await db.sequelize.sync(); // Consider using { force: false } or { alter: true } based on your case
    console.log("✅ Database connected successfully");

    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
  }
};

startServer();
