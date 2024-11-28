'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Client.belongsTo(models.Structure,{
        fareingnKey:{
          allowNull:false
        }
      });
    }
  }
  Client.init({
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    localisation: DataTypes.STRING,
    sexe: DataTypes.STRING,
    intervention1: DataTypes. INTEGER,
    intervention2: DataTypes.INTEGER,
    bonus: DataTypes.INTEGER,
    numeroTel: DataTypes.INTEGER,
    structureId: DataTypes.INTEGER,
    trace: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Client',
  });
  return Client;
};