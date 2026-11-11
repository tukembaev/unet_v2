import axios from 'axios';
import { attachRefreshInterceptor } from 'shared/lib/axios-auth-refresh';
import { attachAuthRequestInterceptor } from 'shared/lib/axios-request-auth';

export const apiClient = axios.create({
  baseURL: 'https://uadmin.kstu.kg/api/',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => attachAuthRequestInterceptor(config),
  (error: unknown) => Promise.reject(error)
);

attachRefreshInterceptor(apiClient);
