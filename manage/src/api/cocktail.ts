import request from '../utils/request';

export interface Cocktail {
  id?: number;
  name: string;
  nameEn?: string;
  description?: string;
  difficulty: number;
  baseSpirit?: string;
  tasteTags?: string;
  glassType?: string;
  method?: string;
  tips?: string;
  sortOrder?: number;
  status?: number;
  ingredients?: Array<{
    id: number;
    name: string;
    amount: string;
    isOptional: number;
  }>;
  steps?: Array<{
    stepNumber: number;
    description: string;
  }>;
  categories?: Array<{
    id: number;
    name: string;
  }>;
}

export interface CocktailListParams {
  page?: number;
  pageSize?: number;
  name?: string;
  difficulty?: number;
  baseSpirit?: string;
  status?: number | string;
}

// 获取酒谱列表
export const getCocktailList = (params: CocktailListParams) => {
  return request.get('/cocktails', { params });
};

// 获取酒谱详情
export const getCocktailDetail = (id: number) => {
  return request.get(`/cocktails/${id}`);
};

// 管理端获取酒谱详情（可包含禁用状态）
export const getAdminCocktailDetail = (id: number) => {
  return request.get(`/admin/cocktails/${id}`);
};

// 上传酒谱封面图片，返回 { url: '/uploads/xxx.jpg' }
export const uploadCocktailImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/admin/upload', formData);
};

// 创建酒谱
export const createCocktail = (data: Cocktail) => {
  return request.post('/admin/cocktails', data);
};

// 更新酒谱
export const updateCocktail = (id: number, data: Cocktail) => {
  return request.put(`/admin/cocktails/${id}`, data);
};

// 删除酒谱
export const deleteCocktail = (id: number) => {
  return request.delete(`/admin/cocktails/${id}`);
};

// 批量删除酒谱
export const batchDeleteCocktails = (ids: number[]) => {
  return request.post('/admin/cocktails/batch-delete', { ids });
};

// 更新酒谱状态
export const updateCocktailStatus = (id: number, status: number) => {
  return request.put(`/admin/cocktails/${id}/status`, { status });
};
