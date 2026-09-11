import { FastifyInstance } from "fastify";
import usersRoutes from "../../../modules/users/presentation/http/index.js";
import Login from "@/modules/auth/presentation/index.js";

export async function registerAllRoutes(app: FastifyInstance) {
  const prefix = '/api'
  await app.register(Login, { prefix })
  await app.register(usersRoutes, { prefix });

  console.log('✔ Todas as rotas dos módulos foram registradas');
}