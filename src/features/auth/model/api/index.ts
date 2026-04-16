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


export async function googleAuthRequest(googleAccessToken: string): Promise<unknown> {
  const data = await apiUserClient.post(`users/auth/google`, {
    id_token: googleAccessToken,
  });
  const raw = extractAuthPayload(data.data as unknown as Record<string, unknown>);
  const normalized = normalizeAuthPayload(raw);
  localStorage.setItem("user", JSON.stringify(normalized));
  return data;
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

