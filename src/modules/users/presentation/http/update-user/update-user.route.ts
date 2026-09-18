import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { updateUserSchema } from "./update-users.schema.js";
import { makeUpdateUser } from "../../../container/index.js";
import { authenticationHook } from "@/drivers/http/hooks/authentication.hook.js";

export async function updateUserRoute(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/:id',
    schema: updateUserSchema,
    preHandler: authenticationHook,
    handler: async (request, reply) => {
      const updateUser = makeUpdateUser()
      const userId = request.params.id
      const output = await updateUser.execute(userId, request.body)
      return reply.status(204).send(output)
    }
  })
}