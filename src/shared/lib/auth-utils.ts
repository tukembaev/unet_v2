import { queryClient } from 'shared/config/query-client';

/** После выхода не редиректить с `/` обратно в приложение, пока сессия по cookie не истечёт или пользователь не войдёт снова. */
const SUPPRESS_LOGIN_AUTO_REDIRECT_KEY = 'unet_suppress_login_auto_redirect';

export function shouldSuppressLoginAutoRedirect(): boolean {
  try {
    return sessionStorage.getItem(SUPPRESS_LOGIN_AUTO_REDIRECT_KEY) === '1';
  } catch {
    return false;
  }
}

/** Вызывать после успешного ручного входа (ПИН / Google), чтобы снова разрешить авто-редирект с `/`. */
export function clearSuppressLoginAutoRedirect(): void {
  try {
    sessionStorage.removeItem(SUPPRESS_LOGIN_AUTO_REDIRECT_KEY);
  } catch {
    /* noop */
  }
}

/**
 * Централизованная функция выхода из системы
 * Очищает все данные пользователя и кэш
 */
export const performLogout = () => {
  // Очищаем весь кэш React Query
  queryClient.clear();

  // Очищаем localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('refresh');
  localStorage.removeItem('pin');
  localStorage.removeItem('user');

  // Очищаем sessionStorage
  sessionStorage.clear();

  // После `clear()`, иначе флаг сотрётся: не авто-входить на странице логина при живой cookie-сессии.
  try {
    sessionStorage.setItem(SUPPRESS_LOGIN_AUTO_REDIRECT_KEY, '1');
  } catch {
    /* noop */
  }
};
