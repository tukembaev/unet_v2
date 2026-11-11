import axios from 'axios';
import { attachRefreshInterceptor } from 'shared/lib/axios-auth-refresh';
import { attachAuthRequestInterceptor } from 'shared/lib/axios-request-auth';

export const apiDocsClient = axios.create({
  baseURL: 'https://uadmin.kstu.kg/document-flow/api/document/',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiDocsClient.interceptors.request.use(
  (config) => attachAuthRequestInterceptor(config),
  (error: unknown) => Promise.reject(error)
);

attachRefreshInterceptor(apiDocsClient);
