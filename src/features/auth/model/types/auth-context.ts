import type { ProfileContext } from 'shared/lib/auth-context';

export interface AvailableContext {
  type: ProfileContext;
  full_name?: string | null;
  position?: string | null;
  group_name?: string | null;
  avatar_url?: string | null;
}

export interface AuthLoginResult {
  requires_context_selection: boolean;
  active_context: ProfileContext | null;
  available_contexts: AvailableContext[];
  csrf_token?: string;
}
