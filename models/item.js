"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      item.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "users",
      });
      item.belongsTo(models.category, {
        foreignKey: "category_id",
        as: "categories",
      });
    }
  }
  item.init(
    {
      item_name: DataTypes.STRING,
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "user",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "category",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }
    },
    {
      sequelize,
      modelName: "item",
    }
  );
  return item;
};
