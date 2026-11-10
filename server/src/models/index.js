/**
 * 模型索引文件 - 定义所有模型及其关联关系
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// 定义模型
const Cocktail = require('./Cocktail');
const Ingredient = require('./Ingredient');
const CocktailIngredient = require('./CocktailIngredient');
const CocktailStep = require('./CocktailStep');
const Category = require('./Category');
const CocktailCategory = require('./CocktailCategory');
const User = require('./User');
const Admin = require('./Admin');

// 初始化模型
const models = {
  Cocktail: Cocktail(sequelize, DataTypes),
  Ingredient: Ingredient(sequelize, DataTypes),
  CocktailIngredient: CocktailIngredient(sequelize, DataTypes),
  CocktailStep: CocktailStep(sequelize, DataTypes),
  Category: Category(sequelize, DataTypes),
  CocktailCategory: CocktailCategory(sequelize, DataTypes),
  User: User(sequelize, DataTypes),
  Admin: Admin(sequelize, DataTypes)
};

// 定义关联关系
// Cocktail <-> Ingredient (多对多)
models.Cocktail.belongsToMany(models.Ingredient, {
  through: models.CocktailIngredient,
  foreignKey: 'cocktailId',
  as: 'ingredients'
});

models.Ingredient.belongsToMany(models.Cocktail, {
  through: models.CocktailIngredient,
  foreignKey: 'ingredientId',
  as: 'cocktails'
});

// Cocktail -> CocktailIngredient (一对多，用于获取用量等详细信息)
models.Cocktail.hasMany(models.CocktailIngredient, {
  foreignKey: 'cocktailId',
  as: 'cocktailIngredients'
});

models.CocktailIngredient.belongsTo(models.Ingredient, {
  foreignKey: 'ingredientId',
  as: 'ingredient'
});

// Cocktail -> Steps (一对多)
models.Cocktail.hasMany(models.CocktailStep, {
  foreignKey: 'cocktailId',
  as: 'steps'
});

models.CocktailStep.belongsTo(models.Cocktail, {
  foreignKey: 'cocktailId'
});

// Cocktail <-> Category (多对多)
models.Cocktail.belongsToMany(models.Category, {
  through: models.CocktailCategory,
  foreignKey: 'cocktailId',
  as: 'categories'
});

models.Category.belongsToMany(models.Cocktail, {
  through: models.CocktailCategory,
  foreignKey: 'categoryId',
  as: 'cocktails'
});

module.exports = {
  sequelize,
  ...models
};
