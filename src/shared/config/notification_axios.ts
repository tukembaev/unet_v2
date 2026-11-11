import axios from 'axios';
import { attachRefreshInterceptor } from 'shared/lib/axios-auth-refresh';
import { attachAuthRequestInterceptor } from 'shared/lib/axios-request-auth';

export const apiNotificationClient = axios.create({
  baseURL: 'https://uadmin.kstu.kg/notifications/',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiNotificationClient.interceptors.request.use(
  (config) => attachAuthRequestInterceptor(config),
  (error: unknown) => Promise.reject(error)
);

attachRefreshInterceptor(apiNotificationClient);
