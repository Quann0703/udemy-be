"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .createTable("Registers", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        courseId: {
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
        },
        registeredAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        process: {
          type: Sequelize.STRING,
        },
        endOfCourse: {
          type: Sequelize.STRING,
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
        queryInterface.addConstraint("Registers", {
          fields: ["userId"],
          type: "foreign key",
          name: "register_user_id_fkey",
          references: {
            table: "Users",
            field: "id",
          },
        });
      })
      .then(() => {
        queryInterface.addConstraint("Registers", {
          fields: ["courseId"],
          type: "foreign key",
          name: "register_course_id_fkey",
          references: {
            table: "Courses",
            field: "id",
          },
        });
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Registers");
  },
};
