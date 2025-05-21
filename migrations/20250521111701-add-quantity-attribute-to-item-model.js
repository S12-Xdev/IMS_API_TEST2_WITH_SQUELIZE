"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("item", "quantity", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // You can change this default if needed
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("item", "quantity");
  },
};
