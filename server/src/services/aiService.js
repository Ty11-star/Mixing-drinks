const axios = require('axios');
const { Cocktail, CocktailIngredient, CocktailStep, Ingredient } = require('../models');

const SYSTEM_PROMPT = `你是一位资深的鸡尾酒调酒师。用户会提供他们手头拥有的材料清单。
你的任务：
1. 优先推荐用这些材料能完整调制的经典或创意饮品（也可以推荐一款只缺少量常见材料的）；
2. 如果材料充足，可以额外给出 1-2 款同材料的其他创意玩法；
3. 用量要专业合理，步骤清晰可执行，适合家庭场景；
4. 必须严格输出如下结构的 JSON（不要输出任何 JSON 以外的内容，不要用 markdown 代码块包裹）：
{
  "recommendation": {
    "name": "饮品中文名",
    "nameEn": "English Name",
    "baseSpirit": "基酒/无酒精",
    "glassType": "建议杯型",
    "difficulty": 1,
    "alcoholLevel": "低度|中度|高度|无酒精",
    "ingredients": [{ "name": "材料名", "amount": "45ml" }],
    "steps": ["步骤1", "步骤2"],
    "tips": "制作小贴士",
    "usedIngredients": ["用到的用户材料"],
    "missingIngredients": ["缺少的材料，没有则为空数组"]
  },
  "alternatives": [
    { "name": "另一款饮品名", "idea": "一句话说明怎么用这些材料调制" }
  ],
  "summary": "一句话总结推荐理由"
}
其中 difficulty 为 1-3 的整数（1简单 2中等 3困难）。alternatives 最多 2 项，可为空数组。`;

class AiService {
  /**
   * 根据用户材料生成调酒推荐
   * @param {string[]} ingredients 用户材料名列表
   */
  async recommendByIngredients(ingredients) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey || apiKey === 'your-deepseek-api-key') {
      throw new Error('服务端未配置 DEEPSEEK_API_KEY');
    }
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error('请提供材料清单');
    }

    const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
    const userContent =
      '我手头有这些材料：' + ingredients.join('、') +
      '。请根据以上材料给我推荐可以调制的饮品。';

    const response = await axios.post(
      baseUrl + '/chat/completions',
      {
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent }
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + apiKey
        },
        timeout: 60000
      }
    );

    const content = response.data &&
      response.data.choices &&
      response.data.choices[0] &&
      response.data.choices[0].message
      ? response.data.choices[0].message.content
      : null;

    if (!content) {
      throw new Error('AI 返回内容为空');
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      throw new Error('AI 返回格式解析失败');
    }

    if (!parsed || !parsed.recommendation) {
      throw new Error('AI 返回数据不完整');
    }

    return parsed;
  }

  /**
   * 每日抽卡：酒谱库与 AI 二选一（各约 50% 概率）
   * AI 未配置或生成失败时自动回退到酒谱库，保证每次都有结果
   */
  async randomCocktail() {
    const useAi = Math.random() < 0.5;
    if (!useAi) {
      return await this.randomOfficial();
    }
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey || apiKey === 'your-deepseek-api-key') {
      return await this.randomOfficial();
    }
    try {
      const recipe = await this.generateRandomRecipe();
      return { source: 'ai', ...recipe };
    } catch (e) {
      console.warn('[ai] 随机 AI 配方生成失败，回退官方酒谱：', e.message);
      return await this.randomOfficial();
    }
  }

  /**
   * 从酒谱库随机取一款
   */
  async randomOfficial() {
    const cocktail = await Cocktail.findOne({
      where: { status: 1 },
      order: [Cocktail.sequelize.literal('RAND()')]
    });
    if (!cocktail) {
      try {
        const recipe = await this.generateRandomRecipe();
        return { source: 'ai', ...recipe };
      } catch (e) {
        throw new Error('暂无可用酒谱且 AI 生成失败');
      }
    }
    const [ings, steps] = await Promise.all([
      CocktailIngredient.findAll({
        where: { cocktailId: cocktail.id },
        include: [{ model: Ingredient, as: 'ingredient' }],
        order: [['sortOrder', 'ASC']]
      }),
      CocktailStep.findAll({
        where: { cocktailId: cocktail.id },
        order: [['stepNumber', 'ASC']]
      })
    ]);
    return {
      source: 'official',
      id: cocktail.id,
      name: cocktail.name,
      nameEn: cocktail.nameEn,
      baseSpirit: cocktail.baseSpirit,
      glassType: cocktail.glassType,
      difficulty: cocktail.difficulty,
      description: cocktail.description,
      tips: cocktail.tips,
      tasteTags: this.normalizeTaste(cocktail.tasteTags),
      ingredients: ings.map(i => ({ name: i.ingredient ? i.ingredient.name : '', amount: i.amount || '' })),
      steps: steps.map(s => s.description),
      image: cocktail.image || ''
    };
  }

  normalizeTaste(t) {
    if (!t) return [];
    if (Array.isArray(t)) return t;
    return String(t).split(/[,，·]/).map(s => s.trim()).filter(Boolean);
  }

  /**
   * 调用 DeepSeek 随机创作一款鸡尾酒
   */
  async generateRandomRecipe() {
    const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const response = await axios.post(
      baseUrl + '/chat/completions',
      {
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages: [
          { role: 'system', content: RANDOM_SYSTEM_PROMPT },
          { role: 'user', content: '请随机创作一款鸡尾酒。' }
        ],
        temperature: 1.0,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + apiKey
        },
        timeout: 60000
      }
    );

    const content = response.data &&
      response.data.choices &&
      response.data.choices[0] &&
      response.data.choices[0].message
      ? response.data.choices[0].message.content
      : null;

    if (!content) throw new Error('AI 返回内容为空');

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      throw new Error('AI 返回格式解析失败');
    }

    const r = parsed.recommendation || parsed;
    if (!r || !r.name) throw new Error('AI 返回数据不完整');

    return {
      id: null,
      name: r.name,
      nameEn: r.nameEn || '',
      baseSpirit: r.baseSpirit || '',
      glassType: r.glassType || '',
      difficulty: r.difficulty || 1,
      description: r.description || '',
      tips: r.tips || '',
      tasteTags: Array.isArray(r.tasteTags) ? r.tasteTags : (r.tasteTags ? [r.tasteTags] : []),
      ingredients: Array.isArray(r.ingredients)
        ? r.ingredients.map(i => ({ name: i.name, amount: i.amount || '' }))
        : [],
      steps: Array.isArray(r.steps)
        ? r.steps.map(s => (typeof s === 'string' ? s : s.description))
        : []
    };
  }
}

const RANDOM_SYSTEM_PROMPT = `你是一位极具创意的鸡尾酒调酒师。请随机创作一款有特色、用料合理且可在家操作的鸡尾酒配方（主题不限，可天马行空）。
必须严格输出如下结构的 JSON（不要输出任何 JSON 以外的内容，不要用 markdown 代码块包裹）：
{
  "recommendation": {
    "name": "饮品中文名",
    "nameEn": "English Name",
    "baseSpirit": "基酒/无酒精",
    "glassType": "建议杯型",
    "difficulty": 1,
    "description": "一句话风味描述",
    "tips": "制作小贴士",
    "tasteTags": ["风味1","风味2"],
    "ingredients": [{ "name": "材料名", "amount": "45ml" }],
    "steps": ["步骤1","步骤2"]
  },
  "summary": "一句话总结"
}
其中 difficulty 为 1-3 的整数（1简单 2中等 3困难）。`;

module.exports = new AiService();
