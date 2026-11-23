import request from '../utils/request';

export interface ConvMaterial {
  id?: number;
  name: string;
  emoji?: string;
  category?: string;
  sortOrder?: number;
}

export interface ConvDrink {
  id?: number;
  name: string;
  nameEn?: string;
  emoji?: string;
  gradient?: string;
  cost?: number;
  steps?: number;
  tag?: string;
  tips?: string;
  instructions?: string[];
  materials?: { name: string; amount: string }[];
  scenes?: string[];
  status?: number;
  sortOrder?: number;
}

export interface ConvPitfall {
  id?: number;
  emoji?: string;
  title: string;
  desc?: string;
  sortOrder?: number;
}

// 公开读取（小程序端使用）
export const getPublicConvenience = () => request.get('/convenience');

// 配方管理
export const getConvDrinks = () => request.get('/admin/convenience/drinks');
export const createConvDrink = (data: ConvDrink) => request.post('/admin/convenience/drinks', data);
export const updateConvDrink = (id: number, data: ConvDrink) => request.put(`/admin/convenience/drinks/${id}`, data);
export const deleteConvDrink = (id: number) => request.delete(`/admin/convenience/drinks/${id}`);
export const updateConvDrinkStatus = (id: number, status: number) =>
  request.put(`/admin/convenience/drinks/${id}/status`, { status });

// 材料管理
export const getConvMaterials = () => request.get('/admin/convenience/materials');
export const createConvMaterial = (data: ConvMaterial) => request.post('/admin/convenience/materials', data);
export const updateConvMaterial = (id: number, data: ConvMaterial) => request.put(`/admin/convenience/materials/${id}`, data);
export const deleteConvMaterial = (id: number) => request.delete(`/admin/convenience/materials/${id}`);

// 避坑指南管理
export const getConvPitfalls = () => request.get('/admin/convenience/pitfalls');
export const createConvPitfall = (data: ConvPitfall) => request.post('/admin/convenience/pitfalls', data);
export const updateConvPitfall = (id: number, data: ConvPitfall) => request.put(`/admin/convenience/pitfalls/${id}`, data);
export const deleteConvPitfall = (id: number) => request.delete(`/admin/convenience/pitfalls/${id}`);
