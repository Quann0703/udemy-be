"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Step extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Step, { foreignKey: "trackId", as: "step" });
      this.belongsTo(models.Lesson, { foreignKey: "lessonId", as: "lesson" });
    }
  }
  Step.init(
    {
      uuid: DataTypes.UUID,
      trackId: DataTypes.INTEGER,
      lessonId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      priority: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Step",
    }
  );
  return Step;
};
