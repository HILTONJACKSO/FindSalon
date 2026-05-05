import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string | number;
  email: string;
  role: 'CUSTOMER' | 'OWNER' | 'ADMIN';
  first_name?: string;
  last_name?: string;
  date_joined?: string;
  location?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  initialized: boolean;
  setAuth: (user: User | null, token: string | null) => void;
  setInitialized: (val: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      initialized: false,
      setAuth: (user, token) => set({ user, token }),
      setInitialized: (val) => set({ initialized: val }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'findsalon-auth-storage',
    }
  )
);
