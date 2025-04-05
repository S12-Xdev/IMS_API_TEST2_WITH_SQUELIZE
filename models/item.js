'use strict';
const {
  Model
} = require('sequelize');
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
        foreignKey: 'item_id',
        as: 'user'
      });
    }
  }
  item.init({
    item_name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'item',
  });
  return item;
};