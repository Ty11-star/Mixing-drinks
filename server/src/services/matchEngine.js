/**
 * 纯函数：根据用户拥有的材料，为酒谱计算匹配率与缺失材料。
 * 不依赖数据库，便于单元测试。
 *
 * @param {Array} cocktails 酒谱列表，每个酒谱含 ingredients 数组，
 *       其中每项含 id、name 与 ingredientDetail.{ isOptional, amount }
 * @param {Array<number|string>} userIngredientIds 用户拥有的材料 id 列表
 * @returns {Array} 按匹配率降序排列的结果：{ cocktail, matchRate, missingIngredients }
 */
function matchCocktails(cocktails, userIngredientIds) {
  const userIngredientSet = new Set(userIngredientIds.map(id => parseInt(id)));
  const results = [];

  for (const cocktail of cocktails) {
    const requiredIngredients = cocktail.ingredients.filter(
      ing => ing.ingredientDetail.isOptional === 0
    );

    if (requiredIngredients.length === 0) continue;

    const requiredIds = requiredIngredients.map(ing => ing.id);

    const matchedIds = requiredIds.filter(id => userIngredientSet.has(id));
    const matchCount = matchedIds.length;

    const matchRate = Math.round((matchCount / requiredIngredients.length) * 100);

    const missingIngredients = requiredIngredients
      .filter(ing => !userIngredientSet.has(ing.id))
      .map(ing => ({
        id: ing.id,
        name: ing.name,
        amount: ing.ingredientDetail.amount
      }));

    results.push({
      cocktail: {
        id: cocktail.id,
        name: cocktail.name,
        nameEn: cocktail.nameEn,
        difficulty: cocktail.difficulty,
        baseSpirit: cocktail.baseSpirit,
        tasteTags: cocktail.tasteTags,
        glassType: cocktail.glassType
      },
      matchRate,
      missingIngredients
    });
  }

  results.sort((a, b) => b.matchRate - a.matchRate);

  return results;
}

module.exports = { matchCocktails };
