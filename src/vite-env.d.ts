/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  /** OAuth 2.0 Client ID (Google Cloud Console → Веб-клиент) */
  readonly VITE_GOOGLE_CLIENT_ID?: string
  /** Опционально: точный redirect URI, если не совпадает с `window.location.origin` */
  readonly VITE_GOOGLE_REDIRECT_URI?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

