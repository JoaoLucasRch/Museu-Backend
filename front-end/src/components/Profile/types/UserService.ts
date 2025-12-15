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
  }
};