import api from "@/services/api";

export const UploadService = {
  async uploadEventImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-upload-type": "eventos",
      },
    });

    return response.data.imagem_evento;
  },

  async uploadArtworkImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-upload-type": "obras",
      },
    });

    return response.data.imagens_obras;
  },
};