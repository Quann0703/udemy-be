"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Track extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Step, { foreignKey: "trackId", as: "step" });
    }
  }
  Track.init(
    {
      title: DataTypes.STRING,
      courseId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Track",
    }
  );
  return Track;
};
