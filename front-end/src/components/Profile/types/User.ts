export interface UserProfile {
  id: number;
  nome: string;
  email: string;
  contato: string | null;
  foto: string | null;
  bio: string | null;
  role: 'ARTISTA' | 'ADMIN';
}

// Interface para o formulário de atualização (sem id e role)
export interface UpdateProfileData {
  nome: string;
  email: string;
  contato: string;
  bio: string;
  foto?: string; // URL da foto
}

// Interface para resposta do upload de foto
export interface PhotoUploadResponse {
  message: string;
  foto: string;
}