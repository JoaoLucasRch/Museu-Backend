export interface UserProfile {
  id: number;
  nome: string;
  email: string;
  contato: string | null;
  role: "ARTISTA" | "ADMIN";
  created_at?: string | null; // ← ADICIONAR
}

export interface UpdateProfileData {
  nome: string;
  email: string;
  contato: string;
}