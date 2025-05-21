"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class userItems extends Model {
    static associate(models) {
      // Associations
      userItems.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "user",
      });
      userItems.belongsTo(models.item, {
        foreignKey: "item_id",
        as: "item",
      });
    }
  }

  userItems.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      assigned_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "userItems", // PascalCase
      tableName: "user-items", // match your actual table name (snake_case is also OK)
      timestamps: true, // includes createdAt & updatedAt
    }
  );

  return userItems;
};
