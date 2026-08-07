import { FastifyInstance } from "fastify";

import { NotificationController } from "../controllers/notificationController";

import { verifyJWT } from '../middlewares/verifyJWT';
import { authorizeRole } from '../middlewares/authorizeRole';

export default async function notificationRoutes(
  app: FastifyInstance
) {
  app.get(
    "/notifications",
    {
      preHandler: [
        verifyJWT,
        authorizeRole(["ADMIN"]),
      ],
    },
    NotificationController.getAdminNotifications
  );
}