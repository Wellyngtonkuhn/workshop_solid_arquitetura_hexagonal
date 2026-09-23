import { FastifyInstance } from "fastify";
import { registerValidation } from "./validation.plugin.js";
import { registerErrorHandler } from "./error-handler.plugin.js";
import { registerSwagger } from "./swagger.plugin.js";
import cookie from "@fastify/cookie";

export async function registerPlugins(app: FastifyInstance) {
  console.log("🚀 Initializing Fastify plugins...");

  registerValidation(app);
  console.log("✔ Validation plugin initialized");

  registerErrorHandler(app);
  console.log("✔ Error handler plugin initialized");

  await registerSwagger(app);
  console.log("✔ Swagger plugin initialized");

  await app.register(cookie);

  console.log("✅ All plugins initialized");
}