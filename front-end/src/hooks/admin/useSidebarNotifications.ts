import { useEffect, useState } from "react";

import { NotificationService } from "@/services/notifications/notificationService";

export function useSidebarNotifications() {
  const [notifications, setNotifications] =
    useState({
      eventos: {
        novasSubmissoes: 0,
      },
      obras: {
        pendentes: 0,
      },
    });

  useEffect(() => {
    async function load() {
      const data =
        await NotificationService.getSidebarNotifications();

      setNotifications(data);
    }

    load();
  }, []);

  return notifications;
}