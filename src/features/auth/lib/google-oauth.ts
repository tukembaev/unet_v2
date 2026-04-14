/**
 * OIDC implicit/hybrid: Google перенаправляет на redirect_uri с hash
 * `#id_token=...` (и дополнительно может вернуть access_token).
 * redirect_uri должен совпадать с URI в Google Cloud Console.
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

const NONCE_STORAGE_KEY = "google_oauth_nonce";

function generateNonce() {
  return `nonce_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

export function consumeExpectedGoogleNonce(): string | null {
  const value = sessionStorage.getItem(NONCE_STORAGE_KEY);
  if (value) sessionStorage.removeItem(NONCE_STORAGE_KEY);
  return value;
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
  const nonce = encodeURIComponent(generateNonce());
  sessionStorage.setItem(NONCE_STORAGE_KEY, decodeURIComponent(nonce));
  return (
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    "&response_type=id_token token" +
    `&scope=${scopeParam}` +
    "&include_granted_scopes=true" +
    "&prompt=select_account" +
    `&nonce=${nonce}` +
    `&state=${state}`
  );
}

export function buildGoogleOAuthUrlOrThrow(): string {
  return buildGoogleImplicitAuthUrl();
}
