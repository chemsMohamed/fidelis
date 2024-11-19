'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      structureId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model:'Structures',
          key: 'id'
        }
      },
      nom: {
        allowNull: true,
        type: Sequelize.STRING
      },
      prenom: {
        allowNull: true,
        type: Sequelize.STRING
      },
      localisation: {
        allowNull: true,
        type: Sequelize.STRING
      },
      numeroTel: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      status: {
        allowNull: true,
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Clients');
  }
};