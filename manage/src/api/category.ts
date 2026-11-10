import request from '../utils/request';

export interface Category {
  id?: number;
  name: string;
  type: string;
  icon?: string;
  sortOrder?: number;
  status?: number;
}

export interface CategoryListParams {
  type?: string;
  status?: number | string;
}

// 获取分类列表
export const getCategoryList = (params?: CategoryListParams) => {
  return request.get('/categories', { params });
};

// 获取分类详情
export const getCategoryDetail = (id: number) => {
  return request.get(`/categories/${id}`);
};

// 创建分类
export const createCategory = (data: Category) => {
  return request.post('/admin/categories', data);
};

// 更新分类
export const updateCategory = (id: number, data: Category) => {
  return request.put(`/admin/categories/${id}`, data);
};

// 删除分类
export const deleteCategory = (id: number) => {
  return request.delete(`/admin/categories/${id}`);
};
