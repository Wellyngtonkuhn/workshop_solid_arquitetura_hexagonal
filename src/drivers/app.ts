import Fastify from "fastify";
import { registerPlugins } from "./http/plugins/index.js";
import { registerAllRoutes } from "./http/routes/index.js";
import { registerUserSubscribers } from "../modules/users/application/events/user-subscribers.registry.js";
import { globalEventBus } from "../shared/container/index.js";

function bootstrapSubscribers() {
  // Registra os ouvintes de todos os módulos da aplicação
  registerUserSubscribers(globalEventBus);
  // registerMarketingSubscribers(globalEventBus);
  // registerAnalyticsSubscribers(globalEventBus);
}

export const buildApp = async() => {
  console.log("🚀 Bootstrapping application...")
  const app = Fastify();
  
  bootstrapSubscribers()

  await registerPlugins(app)

  await registerAllRoutes(app)
 
  return app;
};
