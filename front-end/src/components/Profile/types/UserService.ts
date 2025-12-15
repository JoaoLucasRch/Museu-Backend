import axios from 'axios';
import type { UserProfile, UpdateProfileData } from './User';

const API_URL = 'http://localhost:3333'; 

// Configuração básica do Axios com Token
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para injetar o token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interface para resposta do upload de foto
interface PhotoUploadResponse {
  message: string;
  foto: string;
}

export const UserService = {
  // Pega os dados do usuário logado (GET /me)
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/user/me');
    return response.data;
  },

  // Atualiza os dados (PUT /me)
  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    const response = await api.put<UserProfile>('/user/me', data);
    return response.data;
  },

  // Upload de foto de perfil
  uploadProfilePhoto: async (file: File): Promise<PhotoUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    // Pegar token diretamente para não interferir com o interceptor do axios
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/user/me/photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `Erro ${response.status}: ${response.statusText}` 
      }));
      throw new Error(errorData.message || 'Erro ao fazer upload da foto');
    }

    return await response.json();
  }
};