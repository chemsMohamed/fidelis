'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Utilisateurs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roleId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:'Roles',
          key: 'id'
        }
      },
      nom: {
        type: Sequelize.STRING
      },
      prenom: {
        type: Sequelize.STRING
      },
      numeroTel: {
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      motDePasse: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Utilisateurs');
  }
};