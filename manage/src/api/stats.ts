import request from '../utils/request';

export interface DashboardStats {
  overview: {
    cocktailCount: number;
    ingredientCount: number;
    categoryCount: number;
    adminCount: number;
    newCocktailCount: number;
  };
  byBaseSpirit: { name: string; count: number }[];
  byDifficulty: { difficulty: number; count: number }[];
  byMethod: { name: string; count: number }[];
  ingredientsByCategory: { name: string; count: number }[];
  cocktailsPerCategory: { name: string; type: string; count: number }[];
  topIngredients: { name: string; count: number }[];
  recentCocktails: {
    id: number;
    name: string;
    name_en: string | null;
    difficulty: number;
    base_spirit: string | null;
    status: number;
    create_time: string;
  }[];
}

// 获取数据看板统计数据
export const getDashboardStats = () => {
  return request.get('/admin/stats/dashboard') as Promise<{
    code: number;
    message: string;
    data: DashboardStats;
  }>;
};
