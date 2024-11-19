'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Structure extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      models.Structure.belongsTo(models.Activite,{
        fareingnKey:{
          allowNull:false
        }
      });
      models.Structure.belongsTo(models.Utilisateur,{
        fareingnKey:{
          allowNull:false
        }
      });

      models.Structure.hasMany(models.Client)
    }
  }
  Structure.init({
    nom: DataTypes.STRING,
    nomBoss: DataTypes.STRING,
    numeroTel: DataTypes.INTEGER,
    localisation: DataTypes.STRING,
    codeUnique: DataTypes.STRING,
    codeCommercial: DataTypes.STRING,
    statut: DataTypes.BOOLEAN,
    utilisateurId: DataTypes.INTEGER,
    activiteId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Structure',
  });
  return Structure;
};