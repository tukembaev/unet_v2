import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { performLogout } from 'shared/lib/auth-utils';
import { refreshTokensOrLogout } from 'shared/lib/refresh-token';

type Config = InternalAxiosRequestConfig & { _retryAfterRefresh?: boolean };

/**
 * 401 → один раз refresh, повтор запроса; если refresh не удался — logout.
 * Не трогает запросы логина (неверный пароль → toast, без редиректа).
 */
export function attachRefreshInterceptor(
  instance: AxiosInstance,
  options?: { isAuthRequest?: (config: InternalAxiosRequestConfig) => boolean }
) {
  const isAuthRequest =
    options?.isAuthRequest ??
    ((config: InternalAxiosRequestConfig) =>
      Boolean(config.url?.includes('users/auth')));

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as Config | undefined;
      const status = error.response?.status;

      if (status !== 401 || !originalRequest) {
        return Promise.reject(error);
      }

      if (originalRequest._retryAfterRefresh) {
        performLogout();
        window.location.href = '/';
        return Promise.reject(error);
      }

      if (isAuthRequest(originalRequest)) {
        return Promise.reject(error);
      }

      if (!localStorage.getItem('user')) {
        return Promise.reject(error);
      }

      try {
        await refreshTokensOrLogout();
        originalRequest._retryAfterRefresh = true;
        return instance(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }
  );
}
