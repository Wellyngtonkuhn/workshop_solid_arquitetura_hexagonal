import fp from "fastify-plugin"
import { usersRoutes } from "../../../modules/users/presentation/http/index.js"

export const routesPlugin = fp(async (app) => {
  usersRoutes(app)
})