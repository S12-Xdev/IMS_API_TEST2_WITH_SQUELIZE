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
      fname: {
        type: DataTypes.STRING,
        allowNull: false, // or true if optional
      },
      lname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true, // or false if required
        unique: true, // optional: enforce unique phone numbers
      },
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
