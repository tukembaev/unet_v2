import { apiUserClient } from "shared/config";
import { normalizeAuthPayload } from "shared/lib/refresh-token";
import type { ProfileContext } from "shared/lib/auth-context";
import {
  setActiveContext,
  setAvailableContextTypes,
  setCsrfToken,
} from "shared/lib/auth-context";
import {
  applyAuthLoginResult,
  parseAuthLoginResult,
} from "../../lib/parse-auth-login";
import type { AuthLoginResult, AvailableContext } from "../types/auth-context";

function extractAuthPayload(
  body: Record<string, unknown>
): Record<string, unknown> {
  const nested = body.data;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return nested as Record<string, unknown>;
  }
  return body;
}

function persistLegacyUserPayload(raw: Record<string, unknown>): void {
  const normalized = normalizeAuthPayload(raw);
  localStorage.setItem("user", JSON.stringify(normalized));

  const csrf =
    typeof normalized.csrf_token === "string"
      ? normalized.csrf_token
      : typeof raw.csrf_token === "string"
        ? raw.csrf_token
        : null;
  if (csrf?.trim()) {
    setCsrfToken(csrf.trim());
  }
}

function toAuthLoginResult(data: unknown): AuthLoginResult {
  const raw = extractAuthPayload(
    (data ?? {}) as Record<string, unknown>
  );
  const result = parseAuthLoginResult(raw);
  persistLegacyUserPayload(raw);
  applyAuthLoginResult(result);
  return result;
}

export async function loginRequest(
  username: string,
  password: string
): Promise<AuthLoginResult> {
  const { data } = await apiUserClient.post(`users/auth`, {
    username,
    password,
  });
  return toAuthLoginResult(data);
}

export async function googleAuthRequest(
  googleAccessToken: string
): Promise<AuthLoginResult> {
  const { data } = await apiUserClient.post(`users/auth/google`, {
    id_token: googleAccessToken,
  });
  return toAuthLoginResult(data);
}

export async function fetchAvailableContexts(): Promise<AvailableContext[]> {
  const { data } = await apiUserClient.get<unknown>("users/auth/contexts");

  let contexts: AvailableContext[];

  if (Array.isArray(data)) {
    contexts = parseAuthLoginResult({
      requires_context_selection: true,
      active_context: null,
      available_contexts: data,
    }).available_contexts;
  } else {
    const raw = extractAuthPayload((data ?? {}) as Record<string, unknown>);
    if (Array.isArray(raw)) {
      contexts = parseAuthLoginResult({
        requires_context_selection: true,
        active_context: null,
        available_contexts: raw,
      }).available_contexts;
    } else {
      contexts = parseAuthLoginResult({
        requires_context_selection: true,
        active_context: null,
        available_contexts: raw.available_contexts ?? raw.results,
      }).available_contexts;
    }
  }

  if (contexts.length) {
    setAvailableContextTypes(contexts.map((c) => c.type));
  }
  return contexts;
}

export async function selectAuthContext(context: ProfileContext): Promise<void> {
  await apiUserClient.post("users/auth/context", { context });
  setActiveContext(context);
}

export async function logoutRequest(): Promise<void> {
  await apiUserClient.post("users/auth/logout");
}

export async function forgotPasswordRequest(username: string): Promise<string> {
  const { data } = await apiUserClient.post<string>("users/forgot-password", {
    username: username.trim(),
  });
  return data;
}

export async function verifyForgotPasswordCode(code: string): Promise<string> {
  const { data } = await apiUserClient.post<string>("users/forgot-password/verify", {
    code: code.trim(),
  });
  return data;
}

export async function resetPasswordByCode(code: string, newPassword: string): Promise<void> {
  await apiUserClient.post("users/forgot-password/reset", {
    code: code.trim(),
    new_password: newPassword,
  });
}

