import axios from 'axios';
import type { Artwork } from '../types/Artwork';

const API_URL = 'http://localhost:3333'; 

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface CreateArtworkData {
  titulo_obra: string;
  descricao_obra: string;
  categoria_obra: string;
  imagens_obras: string; // Na imagem pede link, então mantemos string
  // Datas são opcionais no backend, então podemos omitir por enquanto ou enviar null
}



export const ArtworkService = {
  getMyArtworks: async (): Promise<Artwork[]> => {
    const response = await api.get<Artwork[]>('/obra/minhas');
    return response.data;
  },
  createArtwork: async (data: CreateArtworkData): Promise<Artwork> => {
    const response = await api.post<Artwork>('/obra', data);
    return response.data;
  },

  deleteArtwork: async (id: number): Promise<void> => {
    await api.delete(`/obra/${id}`);
  }
};