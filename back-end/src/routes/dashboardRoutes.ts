import type { FastifyInstance } from "fastify";

import { DashboardController } from "@/controllers/DashboardController";
import { authorizeRole } from "@/middlewares/authorizeRole";
import { verifyJWT } from "@/middlewares/verifyJWT";

export async function dashboardRoutes(
  app: FastifyInstance
) {

  app.get(
  "/",
  {
    preHandler: [
      verifyJWT,
      authorizeRole(["ADMIN"]),
    ],
  },
  DashboardController.getDashboard
);

}