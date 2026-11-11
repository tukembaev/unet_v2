import axios from 'axios';
import { attachRefreshInterceptor } from 'shared/lib/axios-auth-refresh';
import { attachAuthRequestInterceptor } from 'shared/lib/axios-request-auth';

export const apiClientGo = axios.create({
  baseURL: 'https://uadmin.kstu.kg/task/api/v1/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClientGo.interceptors.request.use((config) => attachAuthRequestInterceptor(config));

attachRefreshInterceptor(apiClientGo);
