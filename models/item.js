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
        as: "category",
      });
    }
  }
  item.init(
    {
      item_name: DataTypes.STRING,
      user_id:  DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "item",
    }
  );
  return item;
};
