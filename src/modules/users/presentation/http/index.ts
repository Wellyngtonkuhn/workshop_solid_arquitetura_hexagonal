import { FastifyInstance } from "fastify";
import { createUserRoute } from "./create-user/create-user.route.js";
import { updateUserRoute } from "./update-user/update-user.route.js";

export function usersRoutes(app: FastifyInstance){
  createUserRoute(app);
  updateUserRoute(app)
}