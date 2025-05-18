"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user", "email", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    await queryInterface.addColumn("user", "password", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("user", "email");
    await queryInterface.removeColumn("user", "password");
  },
};
