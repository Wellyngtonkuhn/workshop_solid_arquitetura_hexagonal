import Fastify from "fastify";
import { registerPlugins } from "./http/plugins/index.js";
import { registerAllRoutes } from "./http/routes/index.js";

export const buildApp = async() => {
  const app = Fastify();

  await registerPlugins(app)

  await registerAllRoutes(app)
 
  return app;
};
