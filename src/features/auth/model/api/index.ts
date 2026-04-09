import { apiUserClient } from "shared/config";
import { normalizeAuthPayload } from "shared/lib/refresh-token";

function extractAuthPayload(
  body: Record<string, unknown>
): Record<string, unknown> {
  const nested = body.data;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return nested as Record<string, unknown>;
  }
  return body;
}

export async function loginRequest(
  username: string,
  password: string
): Promise<unknown> {
  const data = await apiUserClient.post(`users/auth`, {
    username,
    password,
  });
  const raw = extractAuthPayload(data.data as unknown as Record<string, unknown>);
  const normalized = normalizeAuthPayload(raw);
  localStorage.setItem("user", JSON.stringify(normalized));
  return data;
}

/**
 * Обмен access_token Google на сессию UNET (как POST /users/auth).
 * Тело и путь — уточнить по Swagger бэкенда при отличии от контракта.
 */
export async function googleAuthRequest(googleAccessToken: string): Promise<unknown> {
  const data = await apiUserClient.post(`users/auth/google`, {
    access_token: googleAccessToken,
  });
  const raw = extractAuthPayload(data.data as unknown as Record<string, unknown>);
  const normalized = normalizeAuthPayload(raw);
  localStorage.setItem("user", JSON.stringify(normalized));
  return data;
}

export async function logoutRequest(): Promise<void> {
  await apiUserClient.post("users/auth/logout");
}

