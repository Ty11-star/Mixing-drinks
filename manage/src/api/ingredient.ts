import request from '../utils/request';

export interface Ingredient {
  id?: number;
  name: string;
  nameEn?: string;
  category: string;
  description?: string;
  commonUnit?: string;
  status?: number;
}

export interface IngredientListParams {
  page?: number;
  pageSize?: number;
  name?: string;
  category?: string;
  status?: number | string;
}

// 获取材料列表
export const getIngredientList = (params?: IngredientListParams) => {
  return request.get('/ingredients', { params });
};

// 获取材料详情
export const getIngredientDetail = (id: number) => {
  return request.get(`/ingredients/${id}`);
};

// 创建材料
export const createIngredient = (data: Ingredient) => {
  return request.post('/admin/ingredients', data);
};

// 更新材料
export const updateIngredient = (id: number, data: Ingredient) => {
  return request.put(`/admin/ingredients/${id}`, data);
};

// 删除材料
export const deleteIngredient = (id: number) => {
  return request.delete(`/admin/ingredients/${id}`);
};

// 批量删除材料
export const batchDeleteIngredients = (ids: number[]) => {
  return request.post('/admin/ingredients/batch-delete', { ids });
};
