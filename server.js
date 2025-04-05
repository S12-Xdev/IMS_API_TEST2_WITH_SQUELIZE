const dotenv = require("dotenv");
// Load environment variables from .env file
dotenv.config();

const express = require("express");
const CookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");

const connectToDatabase = require("./dbconnect/dbcon"); // Import the database connection module

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
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

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
