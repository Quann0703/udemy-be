"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .createTable("Fields", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        categoryId: {
          type: Sequelize.INTEGER,
        },
        title: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.STRING,
        },
        slug: {
          type: Sequelize.STRING,
        },
        image: {
          type: Sequelize.STRING,
        },
        content: {
          type: Sequelize.TEXT,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() => {
        queryInterface.addConstraint("Fields", {
          fields: ["categoryId"],
          type: "foreign key",
          name: "field_category_id_fkey",
          references: {
            table: "Categories",
            field: "id",
          },
        });
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Fields");
  },
};
