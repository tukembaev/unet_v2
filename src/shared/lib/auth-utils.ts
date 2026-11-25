import { queryClient } from 'shared/config/query-client';
import {
  clearActiveContext,
  clearAvailableContextTypes,
  clearCsrfToken,
} from 'shared/lib/auth-context';

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

/** Пока форма «ПИН = пароль», не уводить со страницы входа. */
const HOLD_LOGIN_SAFETY_KEY = 'unet_hold_login_safety';
/** Черновик входа для восстановления формы после ремаунта (только когда ПИН = пароль). */
const SAFETY_LOGIN_DRAFT_KEY = 'unet_safety_login_draft';
let safetyHoldOwned = false;
/** Идёт loginRequest в safety-flow — не сбрасывать draft при гонке ремаунта. */
let safetyAuthInFlight = false;

export type SafetyLoginDraft = {
  username: string;
  password: string;
};

export function shouldHoldLoginForSafety(): boolean {
  try {
    return sessionStorage.getItem(HOLD_LOGIN_SAFETY_KEY) === '1';
  } catch {
    return false;
  }
}

export function holdLoginForSafety(): void {
  safetyHoldOwned = true;
  try {
    sessionStorage.setItem(HOLD_LOGIN_SAFETY_KEY, '1');
  } catch {
    /* noop */
  }
}

export function clearLoginSafetyHold(): void {
  safetyHoldOwned = false;
  safetyAuthInFlight = false;
  try {
    sessionStorage.removeItem(HOLD_LOGIN_SAFETY_KEY);
  } catch {
    /* noop */
  }
  clearSafetyLoginDraft();
}

export function markSafetyAuthInFlight(inFlight: boolean): void {
  safetyAuthInFlight = inFlight;
  if (inFlight) safetyHoldOwned = true;
}

export function isSafetyAuthInFlight(): boolean {
  return safetyAuthInFlight;
}

/** Флаг после перезагрузки страницы, когда формы safety уже нет. */
export function clearStaleLoginSafetyHold(): void {
  if (safetyHoldOwned) return;
  if (readSafetyLoginDraft()) {
    safetyHoldOwned = true;
    return;
  }
  clearLoginSafetyHold();
}

export function saveSafetyLoginDraft(
  username: string,
  password: string
): void {
  try {
    const draft: SafetyLoginDraft = {
      username: username.trim(),
      password,
    };
    sessionStorage.setItem(SAFETY_LOGIN_DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* noop */
  }
}

export function readSafetyLoginDraft(): SafetyLoginDraft | null {
  try {
    const raw = sessionStorage.getItem(SAFETY_LOGIN_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SafetyLoginDraft>;
    if (
      typeof parsed.username !== 'string' ||
      typeof parsed.password !== 'string' ||
      !parsed.username.trim()
    ) {
      return null;
    }
    return { username: parsed.username, password: parsed.password };
  } catch {
    return null;
  }
}

export function clearSafetyLoginDraft(): void {
  try {
    sessionStorage.removeItem(SAFETY_LOGIN_DRAFT_KEY);
  } catch {
    /* noop */
  }
}

export function isPinUsedAsPassword(username: string, password: string): boolean {
  const pin = username.trim().toLowerCase();
  const pass = password.trim().toLowerCase();
  return pin.length > 0 && pin === pass;
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
  clearActiveContext();
  clearAvailableContextTypes();
  clearCsrfToken();

  // Очищаем sessionStorage
  sessionStorage.clear();

  // После `clear()`, иначе флаг сотрётся: не авто-входить на странице логина при живой cookie-сессии.
  try {
    sessionStorage.setItem(SUPPRESS_LOGIN_AUTO_REDIRECT_KEY, '1');
  } catch {
    /* noop */
  }
};
