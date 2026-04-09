import axios from 'axios';
import { performLogout } from 'shared/lib/auth-utils';

/** Совпадает с `baseURL` в `user_axios` + `users/refresh` → `/users/api/v1/users/refresh` */
const USERS_API_V1 = 'https://uadmin.kstu.kg/users/api/v1/';
const REFRESH_URL = `${USERS_API_V1}users/refresh`;

let refreshPromise: Promise<void> | null = null;

function getCookieValue(name: string): string | undefined {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** Приводит ответ логина/refresh к полям, которые ждут axios-интерсепторы. */
export function normalizeAuthPayload(data: Record<string, unknown>): Record<string, unknown> {
  const access = data.access ?? data.access_token;
  const refresh = data.refresh ?? data.refresh_token;
  return {
    ...data,
    ...(access != null ? { access_token: access } : {}),
    ...(refresh != null ? { refresh_token: refresh } : {}),
  };
}

/**
 * POST `/api/v1/users/refresh` (полный URL см. `REFRESH_URL`).
 * Обновляет `localStorage.user` с новыми токенами. При ошибке — logout и редирект на `/`.
 */
export async function refreshTokensOrLogout(): Promise<void> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('no user');
      }
      const prev = JSON.parse(userStr) as Record<string, unknown>;
      // Для refresh используем только cookie `csrf_refresh_token`.
      const csrfToken = getCookieValue('csrf_refresh_token');
      if (!csrfToken || String(csrfToken).trim() === '') {
        throw new Error('no csrf');
      }

      /** Cookie-сессия + `X-CSRF-TOKEN` из ответа POST `/users/auth` (тело пустое, как в Swagger). */
      const { data } = await axios.post<string | Record<string, unknown>>(
        REFRESH_URL,
        '',
        {
          withCredentials: true,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': String(csrfToken),
            // На случай чувствительности прокси/бэкенда к регистру.
            'x-csrf-token': String(csrfToken),
          },
        }
      );

      const merged =
        typeof data === 'string'
          ? normalizeAuthPayload({
              ...prev,
              access: data,
              access_token: data,
            })
          : normalizeAuthPayload({ ...prev, ...data });
      localStorage.setItem('user', JSON.stringify(merged));
    } catch {
      performLogout();
      window.location.href = '/';
      throw new Error('refresh failed');
    }
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}
