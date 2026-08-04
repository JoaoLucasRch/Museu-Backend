import api from "@/services/api";

export class NotificationService {
  static async getSidebarNotifications() {
    const { data } =
      await api.get("/admin/notifications");

    return data;
  }
}