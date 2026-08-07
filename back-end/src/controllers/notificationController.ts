import { FastifyReply, FastifyRequest } from "fastify";

import { NotificationService } from "../services/notificationService";

export class NotificationController {
  static async getAdminNotifications(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const notifications =
      await NotificationService.getAdminNotifications();

    return reply.send(notifications);
  }
}