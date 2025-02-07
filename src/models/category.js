"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Field, {
        foreignKey: "categoryId",
        as: "field",
      });
    }
  }
  Category.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      slug: DataTypes.STRING,
      image: DataTypes.STRING,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
