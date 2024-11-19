'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Activite.hasMany(models.Structure)
    }
  }
  Activite.init({
    domaine: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Activite',
  });
  return Activite;
};