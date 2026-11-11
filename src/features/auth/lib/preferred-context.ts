import type { ProfileContext } from 'shared/lib/auth-context';
import { getActiveContext } from 'shared/lib/auth-context';
import {
  fetchAvailableContexts,
  selectAuthContext,
} from '../model/api';
import type { AuthLoginResult, AvailableContext } from '../model/types/auth-context';

/** Сотрудник, если он есть; иначе студент. */
export function preferredProfileContext(
  contexts: AvailableContext[]
): ProfileContext | null {
  if (contexts.some((item) => item.type === 'employee')) return 'employee';
  if (contexts.some((item) => item.type === 'student')) return 'student';
  return contexts[0]?.type ?? null;
}

/**
 * Не показывает выбор профиля: при двух ролях включает сотрудника,
 * если сотрудника нет — студента.
 */
export async function ensurePreferredProfile(
  result: AuthLoginResult
): Promise<void> {
  let contexts = result.available_contexts;
  if (!contexts.length && result.requires_context_selection) {
    contexts = await fetchAvailableContexts();
  }

  const preferred = preferredProfileContext(contexts);
  if (!preferred) return;

  const hasBoth =
    contexts.some((item) => item.type === 'employee') &&
    contexts.some((item) => item.type === 'student');
  const active = result.requires_context_selection
    ? null
    : result.active_context ?? getActiveContext();

  if (result.requires_context_selection) {
    await selectAuthContext(preferred);
    return;
  }

  if (hasBoth && active !== 'employee') {
    await selectAuthContext('employee');
  }
}
