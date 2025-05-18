const dotenv = require("dotenv");
// Load environment variables from .env file
dotenv.config();

const express = require("express");
const CookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");

const CustomErrorHandler = require("./utils/customErrorHandler"); // Custom error handler

const connectToDatabase = require("./dbconnect/dbcon"); // Import the database connection module

const globalErrorHandller = require("./controllers/globalErrorHandller");

const { category } = require("./models"); // Import the Catagory model
const { item } = require("./models"); // Import the Item model
const { user } = require("./models"); // Import the User model

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet()); // Security middleware
app.use(CookieParser()); // Cookie parsing middleware

// CORS middleware
// Allow requests from specific origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend-domain.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials
};
// Use CORS middleware with options
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Route handlers
app.post("/api/catagory/addCatagory", async (req, res) => {
  const catName = req.body.catName;
  try {
    if (!catName) {
      throw new CustomErrorHandler("Catagory name is required", 400);
    }
    // Simulate adding a category to the database
    const newCatagory = await category.create({ catName });
    if (!newCatagory) {
      throw new CustomErrorHandler("Failed to add category", 500);
    }
    res.status(201).json({
      message: "Category added successfully",
      data: newCatagory,
    });
  } catch (error) {
    throw new CustomErrorHandler(error, 500);
  }
});

app.post("/api/item/addItem", async (req, res, next) => {
  const { itemName, catName } = req.body;

  try {
    const catId = await category.findOne({
      where: { catName },
    });

    if (!catId) {
      throw new CustomErrorHandler("Category not found", 404);
    }

    const catid = catId.id; // Assuming the category model has an 'id' field

    const newItem = await item.create({
      item_name: itemName,
      category_id: catid,
    });

    res.status(201).json({
      message: "Item added successfully",
      data: newItem,
    });
  } catch (error) {
    next(error); // Forward the error to the global error handler
  }
});
app.post("/api/admin/registerUser", async (req, res, next) => {
  const { userFname, userLname, userEmail, userPassword } = req.body;

  try {
    const catId = await user.findOne({
      where: { catName },
    });

    if (!catId) {
      throw new CustomErrorHandler("Category not found", 404);
    }

    const catid = catId.id; // Assuming the category model has an 'id' field

    const newItem = await item.create({
      item_name: itemName,
      category_id: catid,
    });

    res.status(201).json({
      message: "Item added successfully",
      data: newItem,
    });
  } catch (error) {
    next(error); // Forward the error to the global error handler
  }
});

// Error handling middleware
app.all("*", (req, res, next) => {
  // res.status(404).json({ message: "Endpoint not found" });
  // const err = new Error("Page not found");
  // err.status = 404;
  // next(err)

  const error = new CustomErrorHandler("This Page is not found", 404);
  next(error);
});

// Global error handler
app.use(globalErrorHandller);

// database connection and Start the server
const startConnection = async () => {
  try {
    await connectToDatabase();
    console.log("✅ Database connection established successfully.");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Unable to connect to the database:", err);
  }
};

startConnection();
