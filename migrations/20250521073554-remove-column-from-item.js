"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove 'user_id' column from 'item' table
    await queryInterface.removeColumn("item", "user_id");
  },

  down: async (queryInterface, Sequelize) => {
    // Optional: add the column back if migration is reverted
    await queryInterface.addColumn("item", "user_id", {
      type: Sequelize.integer, // Use the correct data type used previously
      allowNull: true, // Set as per original schema
    });
  },
};
