"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Invoices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      courseId: {
        type: Sequelize.INTEGER,
      },
      total: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      orderAt: {
        type: Sequelize.DATE,
      },
      amount: {
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
    });
    // .then(() => {
    //   queryInterface.addConstraint("Invoices", {
    //     fields: ["courseId"],
    //     type: "foreign key",
    //     name: "invoice_course_id_fkey",
    //     references: {
    //       table: "Courses",
    //       field: "id",
    //     },
    //   });
    // })
    // .then(() => {
    //   queryInterface.addConstraint("Invoices", {
    //     fields: ["userId"],
    //     type: "foreign key",
    //     name: "invoice_user_id_fkey",
    //     references: {
    //       table: "Users",
    //       field: "id",
    //     },
    //   });
    // });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Invoices");
  },
};
