import request from '../utils/request';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: {
    id: number;
    username: string;
    nickname: string;
    email: string;
  };
}

// 管理员登录
export const login = (data: LoginParams) => {
  return request.post<any, { data: LoginResponse }>('/admin/login', data);
};

// 获取当前管理员信息
export const getCurrentAdmin = () => {
  return request.get('/admin/profile');
};

// 退出登录
export const logout = () => {
  return request.post('/admin/logout');
};
