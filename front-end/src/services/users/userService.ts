import api from "@/services/api";
import type { UserProfile } from "@/types/User";

export interface RegisterAdminData {
  nome: string;
  email: string;
  contato: string;
  senha: string;
}

export const UserService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get("/user/me");
    return response.data;
  },

  async updateProfile(data: Partial<UserProfile>) {
    const response = await api.put("/user/me", data);
    return response.data;
  },

  async registerAdmin(data: RegisterAdminData) {
    const response = await api.post(
      "/auth/register-admin",
      data
    );

    return response.data;
  },

  /* ============================
     ADMIN
  ============================ */

  async getAll(): Promise<UserProfile[]> {
    const response = await api.get("/user/admin");

    return response.data;
  },

  async getById(
    id: number
  ): Promise<UserProfile> {
    const response = await api.get(
      `/user/${id}`
    );

    return response.data;
  },
};