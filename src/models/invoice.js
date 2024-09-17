"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      this.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
      this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    }
  }
  Invoice.init(
    {
      userId: DataTypes.INTEGER,
      courseId: DataTypes.INTEGER,
      description: { type: DataTypes.STRING },
      orderAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      total: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Invoice",
    }
  );
  return Invoice;
};
