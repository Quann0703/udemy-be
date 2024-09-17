"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Course, { foreignKey: "courseId", as: "course" });
      this.hasMany(models.Quiz, { foreignKey: "lessonId", as: "quizzes" });
    }
  }
  Lesson.init(
    {
      courseId: DataTypes.INTEGER,
      stepId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      content: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      image: DataTypes.STRING,
      videoType: DataTypes.STRING,
      video: DataTypes.STRING,
      isPublished: DataTypes.BOOLEAN,
      PublishedAt: DataTypes.DATE,
      position: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Lesson",
    }
  );
  return Lesson;
};
