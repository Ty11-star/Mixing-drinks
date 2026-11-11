import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
});

const LOGIN_PATH = '/login';
let redirecting = false;

// 令牌失效时清干净两份本地凭据并跳登录页。
// 后端 token 失效返回的是 HTTP 200 + { code: 401 }，不会进 axios 的错误拦截器，
// 因此成功拦截器和错误拦截器都要调用这里。
const handleSessionExpired = () => {
  useAuthStore.getState().clearAuth();
  // zustand persist 还会写一份 auth-storage，只删 admin_token 会导致刷新后又"已登录"
  localStorage.removeItem('auth-storage');

  if (window.location.pathname === LOGIN_PATH || redirecting) return;
  redirecting = true;
  window.location.replace(`${LOGIN_PATH}?expired=1`);
};

// 登录接口密码错误也返回 HTTP 401，不能当成令牌过期处理
const isLoginRequest = (url?: string) => !!url && url.includes('/admin/login');

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

    // 令牌无效或已过期：后端用 HTTP 200 + code 401 表达，必须在这里拦截
    if (Number(res.code) === 401) {
      handleSessionExpired();
      return Promise.reject(new Error(res.message || '登录已过期，请重新登录'));
    }

    // 业务错误
    return Promise.reject(new Error(res.message || '请求失败'));
  },
  (error) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status } = error.response;

      if (status === 401 && !isLoginRequest(error.config?.url)) {
        // 未授权，清除凭据并跳转到登录页
        handleSessionExpired();
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
