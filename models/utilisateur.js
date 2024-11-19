'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Utilisateur.belongsTo(models.Role,{
        fareingnKey:{
          allowNull:false
        }
      });
      models.Utilisateur.hasMany(models.Structure);
    }
  }
  Utilisateur.init({
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    numeroTel: DataTypes.INTEGER,
    code: DataTypes.STRING,
    email: DataTypes.STRING,
    motDePasse: DataTypes.STRING,
    roleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Utilisateur',
  });
  return Utilisateur;
};