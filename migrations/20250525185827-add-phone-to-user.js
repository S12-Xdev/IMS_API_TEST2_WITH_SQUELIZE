"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user", "phone", {
      type: Sequelize.STRING,
      allowNull: true, // or false if required
      unique: true, // optional: enforce unique phone numbers
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("user", "phone");
  },
};

