import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import { AuthService } from './auth.service';
import router from '@/router';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

// Request Interceptor: Attach fresh MSAL Token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AuthService.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Token renewal rejected by Microsoft (revoked session / disabled user)
      await AuthService.logout();
      router.push({ name: 'login' });
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: Catch any 401 from Go and redirect to Login
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Session expired or revoked by admin. Redirecting to login...');
      await AuthService.logout();
      router.push({ name: 'login' });
    }
    return Promise.reject(error);
  }
);

export class ApiService {
  public static async getDashboardData() {
    const response = await api.get('/getDashboard');
    return response.data;
  }
}