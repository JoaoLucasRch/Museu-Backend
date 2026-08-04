export interface UserProfile {
  id: number;
  nome: string;
  email: string;
  contato: string | null;
  role: "ARTISTA" | "ADMIN";
}

export interface UpdateProfileData {
  nome: string;
  email: string;
  contato: string;
}