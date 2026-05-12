import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/',
});

export const getImageUrl = (path: string | null | undefined) => {
  if (!path) return 'https://placehold.co/800x600/FDF9F0/B45309?text=FindSalon';
  if (path.startsWith('http')) return path;
  // Standardize on 127.0.0.1 to match the default baseURL
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace('/api', '');
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};


api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const isAuthPath = config.url?.includes('auth/register') || config.url?.includes('auth/login');
    
    if (token && !isAuthPath) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we get a 401, it means the token is likely expired or invalid.
    // Since we are using Firebase, the AuthProvider handles token lifecycle.
    // We avoid automatic redirects here to prevent loops during initialization.
    if (error.response?.status === 401) {
      console.warn("API returned 401 Unauthorized. Token might be expired.");
      // You could optionally trigger a logout here if you're sure the session is dead,
      // but usually onAuthStateChanged will handle this.
    }
    return Promise.reject(error);
  }
);
