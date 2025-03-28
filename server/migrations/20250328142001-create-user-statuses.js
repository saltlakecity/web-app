'use strict';
    module.exports = {
      up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('user_statuses', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          user_id: {
            type: Sequelize.BIGINT,  //  или INTEGER, если ID пользователя не очень большой
            allowNull: false
          },
          form_id: {
            type: Sequelize.STRING,  //  или INTEGER, в зависимости от типа ID формы
            allowNull: false
          },
          status: {
            type: Sequelize.STRING,
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

        //  Можно добавить индекс для ускорения поиска по user_id и form_id
        await queryInterface.addIndex('user_statuses', ['user_id', 'form_id']);
      },
      down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('user_statuses');
      }
    };