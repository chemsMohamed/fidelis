'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Utilisateurs', [
      { 
        nom: 'admin',
        prenom: 'ADMIN',
        phone: 123456,
        email: 'chems@gmail.com',
        motDePasse: '$2a$12$96vlfVygnxTkX9dvw8RsquN7L/57Dac4Vx507//9qFr0jsqnt30/m'
       },
      
      
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
