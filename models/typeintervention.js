'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypeIntervention extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.TypeIntervention.hasMany(models.Structure)
    }
  }
  TypeIntervention.init({
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TypeIntervention',
  });
  return TypeIntervention;
};