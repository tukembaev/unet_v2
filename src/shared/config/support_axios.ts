import axios, { type InternalAxiosRequestConfig } from 'axios';
import { attachRefreshInterceptor } from 'shared/lib/axios-auth-refresh';
import { attachAuthRequestInterceptor } from 'shared/lib/axios-request-auth';

function getAccessTokenFromStorage(): string | null {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const user = JSON.parse(raw) as Record<string, unknown>;
    const token = user.access_token ?? user.access ?? user.token;
    return typeof token === 'string' && token.trim() ? token.trim() : null;
  } catch {
    return null;
  }
}

function attachBearer(config: InternalAxiosRequestConfig) {
  const token = getAccessTokenFromStorage();
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization =
      `Bearer ${token}`;
  }
  return config;
}

/** Авторизованный клиент Support Service: https://uadmin.kstu.kg/api/support */
export const apiSupportClient = axios.create({
  baseURL: 'https://uadmin.kstu.kg/api/support',
  timeout: 20000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiSupportClient.interceptors.request.use(
  (config) => attachBearer(attachAuthRequestInterceptor(config)),
  (error: unknown) => Promise.reject(error)
);
attachRefreshInterceptor(apiSupportClient);

/** Публичный клиент (создание обращения / категории без logout на 401). */
export const apiSupportPublicClient = axios.create({
  baseURL: 'https://uadmin.kstu.kg/api/support',
  timeout: 20000,
  withCredentials: true,
});
