"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.belongsTo(models.previlege, {
        foreignKey: "role_id",
        as: "role",
      });
      user.hasMany(models.userItems, {
        foreignKey: "user_id",
        as: "userItems",
      });
    }
  }
  user.init(
    {
      fname: DataTypes.STRING,
      lname: DataTypes.STRING,
      role_id: DataTypes.INTEGER,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "user",
      tableName: "user",
    }
  );
  return user;
};
