'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class catagory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      catagory.hasMany(models.item, {
        foreignKey: "category_id",
        as: "category",
      });
    }
  }
  catagory.init({
    catname: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'catagory',
  });
  return catagory;
};