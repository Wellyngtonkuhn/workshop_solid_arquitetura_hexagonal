import { FastifyInstance } from "fastify";
import { LoginRoute } from "./login/index.route.js";


export default async function Login(app: FastifyInstance){
  const prefix = "/auth";

  await app.register(LoginRoute, { prefix })
}