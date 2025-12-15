/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  // Adicione outras variáveis conforme necessário
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}