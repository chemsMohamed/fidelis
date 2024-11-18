'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Structures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        allowNull: false,
        type: Sequelize.STRING
      },
      numeroTel: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      codeUnique: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      codeCommercial: {
        allowNull: false,
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
      serviceId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:'Services',
          key: 'id'
        }
      },
      utilisateurId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:'Utilisateurs',
          key: 'id'
        }
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
    await queryInterface.dropTable('Structures');
  }
};