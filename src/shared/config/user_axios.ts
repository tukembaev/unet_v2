import axios from 'axios';
import { attachRefreshInterceptor } from 'shared/lib/axios-auth-refresh';
import { attachAuthRequestInterceptor } from 'shared/lib/axios-request-auth';

export const apiUserClient = axios.create({
  baseURL: 'https://uadmin.kstu.kg/users/api/v1/',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiUserClient.interceptors.request.use(
  (config) => attachAuthRequestInterceptor(config),
  (error: unknown) => Promise.reject(error)
);

attachRefreshInterceptor(apiUserClient);
