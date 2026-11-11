import type {
  AuthLoginResult,
  AvailableContext,
} from '../model/types/auth-context';
import {
  clearActiveContext,
  isProfileContext,
  setActiveContext,
  setAvailableContextTypes,
  setCsrfToken,
} from 'shared/lib/auth-context';

function parseAvailableContexts(raw: unknown): AvailableContext[] {
  if (!Array.isArray(raw)) return [];

  const items: AvailableContext[] = [];

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const type = String(row.type ?? '').trim();
    if (!isProfileContext(type)) continue;
    items.push({
      type,
      full_name: row.full_name != null ? String(row.full_name) : null,
      position: row.position != null ? String(row.position) : null,
      group_name: row.group_name != null ? String(row.group_name) : null,
      avatar_url: row.avatar_url != null ? String(row.avatar_url) : null,
    });
  }

  return items;
}

export function parseAuthLoginResult(
  raw: Record<string, unknown>
): AuthLoginResult {
  const activeRaw = raw.active_context;
  const active_context =
    typeof activeRaw === 'string' && isProfileContext(activeRaw)
      ? activeRaw
      : null;

  const csrf_token =
    typeof raw.csrf_token === 'string' && raw.csrf_token.trim()
      ? raw.csrf_token.trim()
      : typeof raw.csrf === 'string' && raw.csrf.trim()
        ? raw.csrf.trim()
        : undefined;

  return {
    requires_context_selection: raw.requires_context_selection === true,
    active_context,
    available_contexts: parseAvailableContexts(raw.available_contexts),
    csrf_token,
  };
}

/** Сохраняет csrf и контекст после логина (один профиль). */
export function applyAuthLoginResult(result: AuthLoginResult): void {
  if (result.csrf_token) {
    setCsrfToken(result.csrf_token);
  }

  if (result.available_contexts.length) {
    setAvailableContextTypes(result.available_contexts.map((c) => c.type));
  }

  if (!result.requires_context_selection && result.active_context) {
    setActiveContext(result.active_context);
    return;
  }

  if (result.requires_context_selection) {
    clearActiveContext();
  }
}
