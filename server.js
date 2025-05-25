"use strict";

const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

// Routes
const authRoutes = require("./routes/authRoute");
const adminRoutes = require("./routes/adminRoute");
const clerkRoutes = require("./routes/clerkRoute");
const userRoutes = require("./routes/userRoute");
const venderRoutes = require("./routes/venderRoute");

// Load environment variables
dotenv.config();

// Validate critical environment variables
if (!process.env.PORT || !process.env.DB_HOST) {
  console.error(
    "❌ Missing required environment variables (PORT, DB_HOST, etc.)"
  );
  process.exit(1);
}

// Sequelize and models
const db = require("./models");

// Error handling
const globalErrorHandler = require("./controllers/globalErrorHandller");
const CustomErrorHandler = require("./utils/customErrorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------- MIDDLEWARE -------------------

// Security headers
app.use(helmet());

// Logger (for development)
app.use(morgan("dev"));

// Parse cookies
app.use(cookieParser());

// Parse JSON and form data with size limits
app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true, limit: "3mb" }));

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

// Serve static files (e.g., images, uploads)
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------- ROUTES -------------------

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// Main application routes
app.use("/login", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/clerk", clerkRoutes);
app.use("/api/user", userRoutes);
app.use("/api/vender", venderRoutes);

// ------------------- ERROR HANDLING -------------------

// 404 handler
app.all("*", (req, res, next) => {
  next(new CustomErrorHandler("This page is not found", 404));
});

// Global error handler
app.use(globalErrorHandler);

// ------------------- SERVER INIT -------------------

const startServer = async () => {
  try {
    await db.sequelize.sync(); // Use { alter: true } or migrations in production
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(`❌ Error connecting to the database: ${err.message}`);
    process.exit(1);
  }
};

startServer();
