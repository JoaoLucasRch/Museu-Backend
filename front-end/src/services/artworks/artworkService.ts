import api from "@/services/api";
import type {
  Artwork,
  CreateArtworkData,
} from "@/types/Artwork";

export const ArtworkService = {

  async createArtwork(
    data: CreateArtworkData
  ): Promise<Artwork> {

    const response = await api.post(
      "/obra",
      data
    );

    return response.data;
  },

async getMyArtworks(): Promise<Artwork[]> {
  const response = await api.get("/obra/minhas");

  console.log("RESPONSE.DATA:", response.data);

  return response.data;
},

  async deleteArtwork(
    id: number
  ): Promise<void> {

    await api.delete(
      `/obra/${id}`
    );
  },

  async getAllForAdmin(): Promise<Artwork[]> {

    const response =
      await api.get("/obra/admin");

    return response.data;
  },

    async updateStatus(
    id: number,
    status: "aprovada" | "rejeitada" | "exposta",
    parecer?: string
  ): Promise<void> {

    await api.patch(
      `/obra/admin/${id}/status`,
      { status }
    );

  },

};