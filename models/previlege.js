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
      // define association here
      previlege.hasMany(models.user, {
        foreignKey: "user_id",
        as: "users",
      });
    }
  }
  previlege.init({
    role: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'previlege',
  });
  return previlege;
};