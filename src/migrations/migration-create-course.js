"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .createTable("Courses", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        topicId: {
          type: Sequelize.INTEGER,
        },
        creatorId: {
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
        icon: {
          type: Sequelize.STRING,
        },
        rating: {
          type: Sequelize.INTEGER,
        },
        rank: {
          type: Sequelize.INTEGER,
        },
        language: {
          type: Sequelize.STRING,
        },
        require: {
          type: Sequelize.TEXT,
        },
        describe: {
          type: Sequelize.TEXT,
        },
        content: {
          type: Sequelize.TEXT,
        },
        oldPrice: {
          type: Sequelize.INTEGER,
        },
        price: {
          type: Sequelize.INTEGER,
        },
        video: {
          type: Sequelize.STRING,
        },
        studentsCount: {
          type: Sequelize.INTEGER,
        },
        publishedAt: {
          type: Sequelize.DATE,
        },
        priority: {
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
        queryInterface.addConstraint("Courses", {
          fields: ["topicId"],
          type: "foreign key",
          name: "course_topic_id_fkey",
          references: {
            table: "Topics",
            field: "id",
          },
        });
      })
      .then(() => {
        queryInterface.addConstraint("Courses", {
          fields: ["creatorId"],
          type: "foreign key",
          name: "course_user_id_fkey",
          references: {
            table: "Users",
            field: "id",
          },
        });
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Courses");
  },
};
