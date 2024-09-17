"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Field extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
      this.hasMany(models.Topic, {
        foreignKey: "fieldId",
        as: "topic",
      });
    }
  }
  Field.init(
    {
      categoryId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      slug: DataTypes.STRING,
      image: DataTypes.STRING,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Field",
    }
  );
  return Field;
};
