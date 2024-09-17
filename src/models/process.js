"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Process extends Model {
    static associate(models) {
      // define association here
    }
  }
  Process.init(
    {
      trackId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      stepId: DataTypes.INTEGER,
      dateCompleted: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Process",
    }
  );
  return Process;
};
