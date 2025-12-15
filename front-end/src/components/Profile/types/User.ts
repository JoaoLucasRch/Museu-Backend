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
  // Foto geralmente tratamos separado se for upload de arquivo, 
  // mas se for URL (string) segue aqui:
  foto?: string; 
}