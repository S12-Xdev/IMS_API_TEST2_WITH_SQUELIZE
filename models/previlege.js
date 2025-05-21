'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class previlege extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      previlege.hasMany(models.user, {
        foreignKey: "role_id",
        as: "users",
      });
    }
  }
  previlege.init(
    {
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "previlege",
      tableName: "previlege",
    }
  );
  return previlege;
};