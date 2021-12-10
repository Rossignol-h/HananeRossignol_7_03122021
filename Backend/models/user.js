"use strict"
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association between table
      models.User.hasMany(models.Post)
      models.User.hasMany(models.Comment)
      models.User.hasMany(models.Like)
    }
  }
  User.init(
    {
      username: { type: DataTypes.STRING(20), allowNull: false },
      email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(150), allowNull: false },
      avatar: { type: DataTypes.STRING, allowNull: true },
      isAdmin: { type: DataTypes.BOOLEAN, allowNull: false, default: false },
    },
    {
      sequelize,
      modelName: "User",
    },
    {}
  )
  return User
}
