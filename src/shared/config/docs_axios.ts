import axios from 'axios';
import { performLogout } from 'shared/lib/auth-utils';

export const apiDocsClient = axios.create({
  baseURL: 'https://uadmin.kstu.kg/document-flow/api/document/',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiDocsClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
      type AuthData = {
  access_token: string;
  refresh_token: string;
  csrf_token: string;
};


    const userStr = localStorage.getItem('user');

    const user: AuthData | null = userStr ? JSON.parse(userStr) : null;


    if (user) {
      config.headers.Authorization = `Bearer ${user.access_token}`;
  }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiDocsClient.interceptors.response.use(
  (response) => response,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: any) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - очищаем все данные и кэш
      performLogout();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

