import { prisma } from "@/prisma";

export class NotificationService {
  static async getAdminNotifications() {
    const obrasPendentes =
      await prisma.obra.count({
        where: {
          status: "pendente",
        },
      });

    const novasSubmissoes =
      await prisma.obra.count({
        where: {
          status: "pendente",
          edital_id: {
            not: null,
          },
        },
      });

    const dashboardNotifications =
      obrasPendentes > 0 ||
      novasSubmissoes > 0;

    return {
      eventos: {
        novasSubmissoes,
      },

      obras: {
        pendentes: obrasPendentes,
      },
    };
  }
}