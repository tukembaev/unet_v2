import axios from 'axios';
import { attachRefreshInterceptor } from 'shared/lib/axios-auth-refresh';

export const apiUserClient = axios.create({
  baseURL: 'https://uadmin.kstu.kg/users/api/v1/',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiUserClient.interceptors.request.use(
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

attachRefreshInterceptor(apiUserClient);
