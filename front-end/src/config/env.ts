// Configurações de ambiente para o Vite
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3333',
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
} as const;