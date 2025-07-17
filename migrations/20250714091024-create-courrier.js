'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courriers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numero: {
        type: Sequelize.STRING
      },
      dateReception: {
        type: Sequelize.DATE
      },
      dateSignature: {
        type: Sequelize.DATE
      },
      objet: {
        type: Sequelize.STRING
      },
      canal: {
        type: Sequelize.STRING
      },
      expediteur: {
        type: Sequelize.STRING
      },
      destinataire: {
        type: Sequelize.STRING
      },
      reference: {
        type: Sequelize.STRING
      },
      delai: {
        type: Sequelize.STRING
      },
      statut: {
        type: Sequelize.STRING
      },
      observations: {
        type: Sequelize.TEXT
      },
      files: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Courriers');
  }
};