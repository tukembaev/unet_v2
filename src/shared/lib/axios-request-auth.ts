import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

import {
  getActiveContext,
  getCsrfToken,
} from 'shared/lib/auth-context';

function getRequestUrl(config: InternalAxiosRequestConfig): string {
  const base = config.baseURL ?? '';
  const path = config.url ?? '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function isLoginRequest(config: InternalAxiosRequestConfig): boolean {
  const method = (config.method ?? 'get').toLowerCase();
  const url = config.url ?? '';
  return (
    method === 'post' &&
    url.includes('users/auth') &&
    !url.includes('auth/context') &&
    !url.includes('auth/logout')
  );
}

function isUsersWriteRequest(config: InternalAxiosRequestConfig): boolean {
  const method = (config.method ?? 'get').toLowerCase();
  if (!['post', 'patch', 'put', 'delete'].includes(method)) return false;
  return getRequestUrl(config).includes('/users/api/v1/');
}

function setRequestHeader(
  config: InternalAxiosRequestConfig,
  name: string,
  value: string
): void {
  const headers = AxiosHeaders.from(config.headers ?? {});
  headers.set(name, value);
  config.headers = headers;
}

function setCsrfHeaders(
  config: InternalAxiosRequestConfig,
  csrf: string
): void {
  // Бэкенд ожидает именно X-CSRF-TOKEN (см. POST /users/auth).
  setRequestHeader(config, 'X-CSRF-TOKEN', csrf);
  setRequestHeader(config, 'x-csrf-token', csrf);
}

/** Cookie + контекст профиля + CSRF для users-service (см. инструкцию по авторизации). */
export function attachAuthRequestInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  config.withCredentials = true;

  if (!isLoginRequest(config)) {
    const context = getActiveContext();
    if (context) {
      setRequestHeader(config, 'X-Profile-Context', context);
    }
  }

  if (isUsersWriteRequest(config) && !isLoginRequest(config)) {
    const csrf = getCsrfToken();
    if (csrf) {
      setCsrfHeaders(config, csrf);
    }
  }

  return config;
}
