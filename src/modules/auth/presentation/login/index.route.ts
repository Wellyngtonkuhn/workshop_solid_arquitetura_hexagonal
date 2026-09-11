import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { LoginSchema } from "./index.schema.js";
import { makeLogin } from "../../container/index.js";

export async function LoginRoute(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/login",
    schema: LoginSchema,
    handler: async (request, reply) => {
      const login = makeLogin()
      const body = request.body
      const output = await login.execute(body)
      return reply.status(200).send(output)
    }
  })
}