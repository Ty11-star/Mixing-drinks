import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 成功响应
    if (res.code === 200 || res.code === 0) {
      return res;
    }

    // 业务错误
    return Promise.reject(new Error(res.message || '请求失败'));
  },
  (error) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // 未授权，清除 token 并跳转到登录页
        localStorage.removeItem('admin_token');
        window.location.href = '/login';
      } else if (status === 403) {
        console.error('无权限访问');
      } else if (status === 404) {
        console.error('请求的资源不存在');
      } else if (status >= 500) {
        console.error('服务器错误');
      }
    }

    return Promise.reject(error);
  }
);

export default request;
