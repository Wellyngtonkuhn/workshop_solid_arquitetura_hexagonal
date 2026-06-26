import { FastifyInstance } from "fastify";
import { registerValidation } from "./validation.plugin.js";
import { registerErrorHandler } from "./error-handler.plugin.js";
import { registerSwagger } from "./swagger.plugin.js";

export async function registerPlugins(app: FastifyInstance) {
  registerValidation(app);
  registerErrorHandler(app);
  await registerSwagger(app);
}