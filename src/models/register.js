"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Register extends Model {
    static associate(models) {
      this.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
      this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    }
  }
  Register.init(
    {
      courseId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      registeredAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      process: DataTypes.STRING,
      endOfCourse: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Register",
    }
  );
  return Register;
};
