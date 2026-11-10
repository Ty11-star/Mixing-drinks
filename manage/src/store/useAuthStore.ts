import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Admin {
  id: number;
  username: string;
  nickname: string;
  email: string;
}

interface AuthState {
  token: string | null;
  admin: Admin | null;
  setAuth: (token: string, admin: Admin) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      admin: null,

      setAuth: (token, admin) => {
        localStorage.setItem('admin_token', token);
        set({ token, admin });
      },

      clearAuth: () => {
        localStorage.removeItem('admin_token');
        set({ token: null, admin: null });
      },

      isAuthenticated: () => {
        return !!get().token;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
