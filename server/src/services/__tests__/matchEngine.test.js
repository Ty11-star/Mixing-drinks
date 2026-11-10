const { matchCocktails } = require('../matchEngine');

// 构造酒谱夹具：ingredients 中每个材料含 ingredientDetail.isOptional(0必需/1可选) 与 amount
function makeCocktail(overrides = {}) {
  return {
    id: 1,
    name: 'Test Cocktail',
    nameEn: 'Test Cocktail',
    difficulty: 1,
    baseSpirit: 'Rum',
    tasteTags: '甜',
    glassType: 'Highball',
    ingredients: [],
    ...overrides
  };
}

function ing(id, name, isOptional, amount) {
  return { id, name, ingredientDetail: { isOptional, amount } };
}

describe('matchCocktails - 根据手头材料推荐可制作酒谱', () => {
  test('当用户拥有全部必需材料时匹配率为 100% 且缺失为空', () => {
    const cocktails = [
      makeCocktail({
        id: 1,
        ingredients: [ing(1, '朗姆酒', 0, '45ml'), ing(2, '青柠汁', 0, '15ml')]
      })
    ];

    const results = matchCocktails(cocktails, [1, 2]);

    expect(results).toHaveLength(1);
    expect(results[0].matchRate).toBe(100);
    expect(results[0].missingIngredients).toEqual([]);
  });

  test('匹配率按用户拥有的必需材料占比计算', () => {
    const cocktails = [
      makeCocktail({
        id: 1,
        ingredients: [ing(1, '朗姆酒', 0, '45ml'), ing(2, '青柠汁', 0, '15ml')]
      })
    ];

    const results = matchCocktails(cocktails, [1]);

    expect(results[0].matchRate).toBe(50);
  });

  test('缺失材料列出 id、名称与用量', () => {
    const cocktails = [
      makeCocktail({
        id: 1,
        ingredients: [ing(1, '朗姆酒', 0, '45ml'), ing(2, '青柠汁', 0, '15ml')]
      })
    ];

    const results = matchCocktails(cocktails, [1]);

    expect(results[0].missingIngredients).toEqual([
      { id: 2, name: '青柠汁', amount: '15ml' }
    ]);
  });

  test('结果按匹配率从高到低排序', () => {
    const cocktails = [
      makeCocktail({
        id: 1,
        name: '低匹配',
        ingredients: [ing(1, '朗姆酒', 0, '45ml'), ing(2, '青柠汁', 0, '15ml')]
      }),
      makeCocktail({
        id: 2,
        name: '高匹配',
        ingredients: [ing(3, '伏特加', 0, '45ml')]
      })
    ];

    const results = matchCocktails(cocktails, [3]);

    expect(results.map(r => r.cocktail.id)).toEqual([2, 1]);
    expect(results[0].matchRate).toBe(100);
    expect(results[1].matchRate).toBe(0);
  });

  test('可选材料不计入匹配率与缺失列表', () => {
    const cocktails = [
      makeCocktail({
        id: 1,
        ingredients: [ing(1, '朗姆酒', 0, '45ml'), ing(99, '薄荷叶', 1, '少许')]
      })
    ];

    const results = matchCocktails(cocktails, []);

    expect(results[0].matchRate).toBe(0);
    expect(results[0].missingIngredients).toEqual([
      { id: 1, name: '朗姆酒', amount: '45ml' }
    ]);
  });

  test('没有必需材料的酒谱被排除', () => {
    const cocktails = [
      makeCocktail({
        id: 1,
        ingredients: [ing(1, '薄荷叶', 1, '少许')]
      })
    ];

    const results = matchCocktails(cocktails, []);

    expect(results).toHaveLength(0);
  });

  test('用户材料 id 为字符串时也能正确匹配', () => {
    const cocktails = [
      makeCocktail({
        id: 1,
        ingredients: [ing(1, '朗姆酒', 0, '45ml')]
      })
    ];

    const results = matchCocktails(cocktails, ['1']);

    expect(results[0].matchRate).toBe(100);
  });
});
