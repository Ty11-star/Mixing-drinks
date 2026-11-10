import request from '../utils/request';

export interface UserItem {
  id: number;
  nickname: string | null;
  avatar: string | null;
  lastLoginTime: string | null;
  createTime: string;
}

export interface UserListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface UserListResult {
  list: UserItem[];
  total: number;
}

// 获取用户列表
export const getUserList = (params: UserListParams = {}) => {
  return request.get('/users', { params }) as Promise<{
    code: number;
    message: string;
    data: UserListResult;
  }>;
};

// 删除用户
export const deleteUser = (id: number) => {
  return request.delete(`/users/${id}`) as Promise<{ code: number; message: string }>;
};
