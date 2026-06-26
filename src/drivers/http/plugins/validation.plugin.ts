import { FastifyInstance } from "fastify"
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"

export function registerValidation(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)
}