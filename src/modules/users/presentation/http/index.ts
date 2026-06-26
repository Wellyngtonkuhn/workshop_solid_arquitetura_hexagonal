import { FastifyInstance } from "fastify";
import { createUserRoute } from "./create-user/create-user.route.js";

export function usersRoutes(app: FastifyInstance){
  createUserRoute(app);
}