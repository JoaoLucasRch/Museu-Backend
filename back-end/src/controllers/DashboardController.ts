import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { DashboardService } from "../services/DashboardService";

export class DashboardController {

  static async getDashboard(
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    const dashboard =
      await DashboardService.getDashboard();

    return reply.send(dashboard);

  }

}