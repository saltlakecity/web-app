'use strict';
    module.exports = {
      up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('form_responses', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          user_id: {
            type: Sequelize.BIGINT,  //  или INTEGER
            allowNull: false
          },
          form_id: {
            type: Sequelize.STRING,  //  или INTEGER
            allowNull: false
          },
          responses: {
            type: Sequelize.TEXT,  //  Используем TEXT для хранения JSON в виде строки
            allowNull: false
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

        //  Индекс для ускорения поиска
        await queryInterface.addIndex('form_responses', ['user_id', 'form_id']);
      },
      down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('form_responses');
      }
    };