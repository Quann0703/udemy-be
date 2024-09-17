"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Field, {
        foreignKey: "fieldId",
        as: "field",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  }
  Topic.init(
    {
      fieldId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      slug: DataTypes.STRING,
      image: DataTypes.STRING,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Topic",
    }
  );
  return Topic;
};
