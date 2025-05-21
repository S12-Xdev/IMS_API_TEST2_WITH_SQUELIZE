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
      item.belongsTo(models.category, {
        foreignKey: "category_id",
        as: "category",
      });
      item.hasMany(models.userItems, {
        foreignKey: "item_id",
        as: "assignedUsers",
      });
    }
  }
  item.init(
    {
      item_name: DataTypes.STRING,
      category_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "item",
      tableName: "item",
    }
  );
  return item;
};
