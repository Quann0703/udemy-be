"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .createTable("Comments", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
        },
        parentId: {
          type: Sequelize.INTEGER,
        },
        commentableId: {
          type: Sequelize.STRING,
        },
        comment: {
          type: Sequelize.TEXT,
        },
        reactionsCount: {
          type: Sequelize.INTEGER,
        },
        deletedAt: {
          type: Sequelize.DATE,
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
        queryInterface.addConstraint("Comments", {
          fields: ["userId"],
          type: "foreign key",
          name: "comment_user_id_fkey",
          references: {
            table: "Users",
            field: "id",
          },
        });
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Comments");
  },
};
