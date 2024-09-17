"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Comment.init(
    {
      userId: DataTypes.INTEGER,
      commentableId: DataTypes.STRING,
      parentId: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
      reactionsCount: DataTypes.INTEGER,
      deletedAt: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
