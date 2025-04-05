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
      // define association here
      user.hasMany(models.item, {
        foreignKey: "user_id",
        as: "items",
      });
      user.belongsTo(models.previlege, {
        foreignKey: "role",
        as: "previleges",
      });
    }
  }
  user.init(
    {
      fname: DataTypes.STRING,
      lname: DataTypes.STRING,
      role: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "previlege",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
