/**
 * Implicit flow: Google перенаправляет на redirect_uri с hash `#access_token=...`.
 * redirect_uri должен совпадать с URI в Google Cloud Console (часто origin без пути).
 */
export function getGoogleOAuthClientId(): string | undefined {
  const id = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
  return id || undefined;
}

/** Должен совпадать с «Authorized redirect URI» в Google Cloud Console. */
export function getGoogleRedirectUri(): string {
  const fromEnv = import.meta.env.VITE_GOOGLE_REDIRECT_URI?.trim();
  if (fromEnv) return fromEnv;
  return window.location.origin;
}

export function buildGoogleImplicitAuthUrl(): string {
  const clientId = getGoogleOAuthClientId();
  if (!clientId) {
    throw new Error("VITE_GOOGLE_CLIENT_ID не задан");
  }
  const redirectUri = getGoogleRedirectUri();
  const scopes = ["openid", "profile", "email"];
  const scopeParam = encodeURIComponent(scopes.join(" "));
  const state = encodeURIComponent(
    `unet_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  );
  return (
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    "&response_type=token" +
    `&scope=${scopeParam}` +
    "&include_granted_scopes=true" +
    `&state=${state}`
  );
}

export function buildGoogleOAuthUrlOrThrow(): string {
  return buildGoogleImplicitAuthUrl();
}
