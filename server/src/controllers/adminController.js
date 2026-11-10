const jwt = require('jsonwebtoken');
const { Admin, Cocktail, CocktailIngredient, CocktailStep, CocktailCategory, Ingredient, Category } = require('../models');
const { success, error } = require('../utils/response');

// 管理员登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找管理员
    const admin = await Admin.findOne({ where: { username, status: 1 } });

    if (!admin) {
      return res.status(401).json(error('用户名或密码错误', 401));
    }

    // 验证密码（明文比对）
    if (admin.password !== password) {
      return res.status(401).json(error('用户名或密码错误', 401));
    }

    // 生成 token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // 更新最后登录时间
    await admin.update({ lastLoginTime: new Date() });

    res.json(success({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        nickname: admin.nickname,
        email: admin.email
      }
    }));
  } catch (err) {
    console.error('登录失败:', err);
    res.status(500).json(error('登录失败'));
  }
};

// 获取当前管理员信息
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!admin) {
      return res.status(404).json(error('管理员不存在', 404));
    }

    res.json(success(admin));
  } catch (err) {
    console.error('获取信息失败:', err);
    res.status(500).json(error('获取信息失败'));
  }
};

// 退出登录
exports.logout = async (req, res) => {
  res.json(success(null, '退出成功'));
};

// ==================== 酒谱管理 ====================

// 创建酒谱
exports.createCocktail = async (req, res) => {
  const t = await Cocktail.sequelize.transaction();

  try {
    const { ingredients, steps, categoryIds, ...cocktailData } = req.body;

    // 创建酒谱
    const cocktail = await Cocktail.create(cocktailData, { transaction: t });

    // 添加材料
    if (ingredients && ingredients.length > 0) {
      const cocktailIngredients = ingredients.map((item, index) => ({
        cocktailId: cocktail.id,
        ingredientId: item.ingredientId,
        amount: item.amount,
        isOptional: item.isOptional || 0,
        sortOrder: index
      }));
      await CocktailIngredient.bulkCreate(cocktailIngredients, { transaction: t });
    }

    // 添加步骤
    if (steps && steps.length > 0) {
      const cocktailSteps = steps.map((item, index) => ({
        cocktailId: cocktail.id,
        stepNumber: item.stepNumber || index + 1,
        description: item.description
      }));
      await CocktailStep.bulkCreate(cocktailSteps, { transaction: t });
    }

    // 添加分类关联
    if (categoryIds && categoryIds.length > 0) {
      const cocktailCategories = categoryIds.map(categoryId => ({
        cocktailId: cocktail.id,
        categoryId
      }));
      await CocktailCategory.bulkCreate(cocktailCategories, { transaction: t });
    }

    await t.commit();
    res.json(success(cocktail, '创建成功'));
  } catch (err) {
    await t.rollback();
    console.error('创建酒谱失败:', err);
    res.status(500).json(error('创建失败'));
  }
};

// 更新酒谱
exports.updateCocktail = async (req, res) => {
  const t = await Cocktail.sequelize.transaction();

  try {
    const { id } = req.params;
    const { ingredients, steps, categoryIds, ...cocktailData } = req.body;

    // 更新酒谱基本信息
    const cocktail = await Cocktail.findByPk(id);
    if (!cocktail) {
      return res.status(404).json(error('酒谱不存在', 404));
    }

    await cocktail.update(cocktailData, { transaction: t });

    // 更新材料（先删除再创建）
    await CocktailIngredient.destroy({ where: { cocktailId: id }, transaction: t });
    if (ingredients && ingredients.length > 0) {
      const cocktailIngredients = ingredients.map((item, index) => ({
        cocktailId: id,
        ingredientId: item.ingredientId,
        amount: item.amount,
        isOptional: item.isOptional || 0,
        sortOrder: index
      }));
      await CocktailIngredient.bulkCreate(cocktailIngredients, { transaction: t });
    }

    // 更新步骤
    await CocktailStep.destroy({ where: { cocktailId: id }, transaction: t });
    if (steps && steps.length > 0) {
      const cocktailSteps = steps.map((item, index) => ({
        cocktailId: id,
        stepNumber: item.stepNumber || index + 1,
        description: item.description
      }));
      await CocktailStep.bulkCreate(cocktailSteps, { transaction: t });
    }

    // 更新分类关联
    await CocktailCategory.destroy({ where: { cocktailId: id }, transaction: t });
    if (categoryIds && categoryIds.length > 0) {
      const cocktailCategories = categoryIds.map(categoryId => ({
        cocktailId: id,
        categoryId
      }));
      await CocktailCategory.bulkCreate(cocktailCategories, { transaction: t });
    }

    await t.commit();
    res.json(success(cocktail, '更新成功'));
  } catch (err) {
    await t.rollback();
    console.error('更新酒谱失败:', err);
    res.status(500).json(error('更新失败'));
  }
};

// 删除酒谱
exports.deleteCocktail = async (req, res) => {
  try {
    const { id } = req.params;

    const cocktail = await Cocktail.findByPk(id);
    if (!cocktail) {
      return res.status(404).json(error('酒谱不存在', 404));
    }

    await cocktail.destroy();
    res.json(success(null, '删除成功'));
  } catch (err) {
    console.error('删除酒谱失败:', err);
    res.status(500).json(error('删除失败'));
  }
};

// 批量删除酒谱
exports.batchDeleteCocktails = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json(error('请提供要删除的ID列表', 400));
    }

    await Cocktail.destroy({ where: { id: ids } });
    res.json(success(null, '批量删除成功'));
  } catch (err) {
    console.error('批量删除失败:', err);
    res.status(500).json(error('批量删除失败'));
  }
};

// 更新酒谱状态
exports.updateCocktailStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const cocktail = await Cocktail.findByPk(id);
    if (!cocktail) {
      return res.status(404).json(error('酒谱不存在', 404));
    }

    await cocktail.update({ status });
    res.json(success(null, '状态更新成功'));
  } catch (err) {
    console.error('更新状态失败:', err);
    res.status(500).json(error('更新状态失败'));
  }
};

// ==================== 材料管理 ====================

// 创建材料
exports.createIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    res.json(success(ingredient, '创建成功'));
  } catch (err) {
    console.error('创建材料失败:', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json(error('材料名称已存在', 400));
    }
    res.status(500).json(error('创建失败'));
  }
};

// 更新材料
exports.updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;

    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      return res.status(404).json(error('材料不存在', 404));
    }

    await ingredient.update(req.body);
    res.json(success(ingredient, '更新成功'));
  } catch (err) {
    console.error('更新材料失败:', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json(error('材料名称已存在', 400));
    }
    res.status(500).json(error('更新失败'));
  }
};

// 删除材料
exports.deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;

    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      return res.status(404).json(error('材料不存在', 404));
    }

    await ingredient.destroy();
    res.json(success(null, '删除成功'));
  } catch (err) {
    console.error('删除材料失败:', err);
    res.status(500).json(error('删除失败'));
  }
};

// 批量删除材料
exports.batchDeleteIngredients = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json(error('请提供要删除的ID列表', 400));
    }

    await Ingredient.destroy({ where: { id: ids } });
    res.json(success(null, '批量删除成功'));
  } catch (err) {
    console.error('批量删除失败:', err);
    res.status(500).json(error('批量删除失败'));
  }
};

// ==================== 分类管理 ====================

// 创建分类
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json(success(category, '创建成功'));
  } catch (err) {
    console.error('创建分类失败:', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json(error('分类已存在', 400));
    }
    res.status(500).json(error('创建失败'));
  }
};

// 更新分类
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json(error('分类不存在', 404));
    }

    await category.update(req.body);
    res.json(success(category, '更新成功'));
  } catch (err) {
    console.error('更新分类失败:', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json(error('分类已存在', 400));
    }
    res.status(500).json(error('更新失败'));
  }
};

// 删除分类
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json(error('分类不存在', 404));
    }

    await category.destroy();
    res.json(success(null, '删除成功'));
  } catch (err) {
    console.error('删除分类失败:', err);
    res.status(500).json(error('删除失败'));
  }
};
