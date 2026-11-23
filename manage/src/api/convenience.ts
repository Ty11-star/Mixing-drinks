/**
 * 便利店调酒 API
 */
import request from '../utils/request';

export interface ConvenienceMaterial {
  id?: number;
  name: string;
  emoji: string;
  category: string;
  image?: string;
  sortOrder?: number;
}

export interface ConvenienceDrink {
  id?: number;
  name: string;
  nameEn?: string;
  emoji: string;
  gradient?: string;
  image?: string;
  cost: number;
  steps: number;
  tag?: string;
  scenes?: string[];
  materials?: Array<{ name: string; amount: string }>;
  instructions?: string[];
  tips?: string;
  isActive?: number;
  sortOrder?: number;
}

export interface ConveniencePitfall {
  id?: number;
  emoji: string;
  title: string;
  description: string;
  sortOrder?: number;
}

// ===== 材料库 =====
export const getMaterials = () => {
  return request.get('/admin/convenience/materials');
};

export const createMaterial = (data: ConvenienceMaterial) => {
  return request.post('/admin/convenience/materials', data);
};

export const updateMaterial = (id: number, data: ConvenienceMaterial) => {
  return request.put(`/admin/convenience/materials/${id}`, data);
};

export const deleteMaterial = (id: number) => {
  return request.delete(`/admin/convenience/materials/${id}`);
};

// ===== 配方 =====
export const getDrinks = () => {
  return request.get('/admin/convenience/drinks');
};

export const createDrink = (data: ConvenienceDrink) => {
  return request.post('/admin/convenience/drinks', data);
};

export const updateDrink = (id: number, data: ConvenienceDrink) => {
  return request.put(`/admin/convenience/drinks/${id}`, data);
};

export const deleteDrink = (id: number) => {
  return request.delete(`/admin/convenience/drinks/${id}`);
};

export const toggleDrinkStatus = (id: number) => {
  return request.put(`/admin/convenience/drinks/${id}/status`);
};

// ===== 避坑指南 =====
export const getPitfalls = () => {
  return request.get('/admin/convenience/pitfalls');
};

export const createPitfall = (data: ConveniencePitfall) => {
  return request.post('/admin/convenience/pitfalls', data);
};

export const updatePitfall = (id: number, data: ConveniencePitfall) => {
  return request.put(`/admin/convenience/pitfalls/${id}`, data);
};

export const deletePitfall = (id: number) => {
  return request.delete(`/admin/convenience/pitfalls/${id}`);
};
