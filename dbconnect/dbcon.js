// dbconnect/dbcon.js
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config(); // Load env vars here too, if this is a separate file

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

// Function to connect
const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};

module.exports = connectToDatabase;
