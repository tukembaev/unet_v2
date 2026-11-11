export const ACTIVE_CONTEXT_KEY = 'active_context';
export const AVAILABLE_CONTEXTS_KEY = 'available_contexts';
export const CSRF_TOKEN_KEY = 'csrf_token';

export type ProfileContext = 'employee' | 'student';

/** Домашний путь сотрудника / студента (без импорта ROUTES — без циклов). */
export const EMPLOYEE_HOME_PATH = '/home';
export const STUDENT_HOME_PATH = '/schedule';

export function isProfileContext(value: string): value is ProfileContext {
  return value === 'employee' || value === 'student';
}

export function getActiveContext(): ProfileContext | null {
  try {
    const value = localStorage.getItem(ACTIVE_CONTEXT_KEY);
    return value && isProfileContext(value) ? value : null;
  } catch {
    return null;
  }
}

export function setActiveContext(context: ProfileContext): void {
  localStorage.setItem(ACTIVE_CONTEXT_KEY, context);
}

export function clearActiveContext(): void {
  localStorage.removeItem(ACTIVE_CONTEXT_KEY);
}

export function getAvailableContextTypes(): ProfileContext[] {
  try {
    const raw = localStorage.getItem(AVAILABLE_CONTEXTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (v): v is ProfileContext => typeof v === 'string' && isProfileContext(v)
    );
  } catch {
    return [];
  }
}

export function setAvailableContextTypes(contexts: ProfileContext[]): void {
  const unique = [...new Set(contexts.filter(isProfileContext))];
  localStorage.setItem(AVAILABLE_CONTEXTS_KEY, JSON.stringify(unique));
}

export function clearAvailableContextTypes(): void {
  localStorage.removeItem(AVAILABLE_CONTEXTS_KEY);
}

export function hasMultipleContexts(): boolean {
  return getAvailableContextTypes().length > 1;
}

/** Редирект после логина / смены профиля. */
export function getAppHomePath(
  context: ProfileContext | null = getActiveContext()
): string {
  return context === 'student' ? STUDENT_HOME_PATH : EMPLOYEE_HOME_PATH;
}

export function getCsrfToken(): string | null {
  try {
    const stored = localStorage.getItem(CSRF_TOKEN_KEY);
    if (stored?.trim()) return stored.trim();

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    const user = JSON.parse(userStr) as { csrf_token?: unknown };
    const fromUser = user.csrf_token;
    if (typeof fromUser === 'string' && fromUser.trim()) {
      return fromUser.trim();
    }
    return null;
  } catch {
    return null;
  }
}

export function setCsrfToken(token: string): void {
  localStorage.setItem(CSRF_TOKEN_KEY, token);
}

export function clearCsrfToken(): void {
  localStorage.removeItem(CSRF_TOKEN_KEY);
}

export function hasActiveContext(): boolean {
  return getActiveContext() != null;
}
