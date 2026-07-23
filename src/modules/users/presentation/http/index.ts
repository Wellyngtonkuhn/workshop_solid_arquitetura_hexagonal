import { FastifyInstance } from "fastify";
import { createUserRoute } from "./create-user/create-user.route.js";
import { updateUserRoute } from "./update-user/update-user.route.js";
import { confirmUserEmailRoute } from "./confirm-email/index.route.js";

export default async function usersRoutes(app: FastifyInstance) {
  const prefix = "/users";

  await app.register(createUserRoute, { prefix });
  await app.register(updateUserRoute, { prefix });
  await app.register(confirmUserEmailRoute, { prefix });
}
