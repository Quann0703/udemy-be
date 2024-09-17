"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .createTable("Lessons", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        courseId: {
          type: Sequelize.INTEGER,
        },
        stepId: {
          type: Sequelize.INTEGER,
        },
        title: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.STRING,
        },
        content: {
          type: Sequelize.TEXT,
        },
        duration: {
          type: Sequelize.INTEGER,
        },
        image: {
          type: Sequelize.STRING,
        },
        videoType: {
          type: Sequelize.STRING,
        },
        video: {
          type: Sequelize.STRING,
        },
        isPublished: {
          type: Sequelize.BOOLEAN,
        },
        PublishedAt: {
          type: Sequelize.DATE,
        },
        position: {
          type: Sequelize.INTEGER,
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
        queryInterface.addConstraint("Lessons", {
          fields: ["courseId"],
          type: "foreign key",
          name: "lesson_course_id_fkey",
          references: {
            table: "Courses",
            field: "id",
          },
        });
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Lessons");
  },
};
