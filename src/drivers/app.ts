import Fastify from "fastify";
import { registerPlugins } from "./http/plugins/index.js";
import { usersRoutes } from "../modules/users/presentation/http/index.js";

export const buildApp = async() => {
  const app = Fastify();

  await registerPlugins(app)

  await app.register(usersRoutes);
 
  return app;
};
