import { FastifyInstance } from "fastify";
import { createUserRoute } from "./create-user/create-user.route.js";
import { updateUserRoute } from "./update-user/update-user.route.js";
import { confirmUserEmail } from "./confirm-email/index.route.js";

export function usersRoutes(app: FastifyInstance){
  createUserRoute(app);
  updateUserRoute(app);
  confirmUserEmail(app);
}