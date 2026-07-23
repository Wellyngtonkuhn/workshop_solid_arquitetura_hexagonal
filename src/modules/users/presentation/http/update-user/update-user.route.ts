import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { makeUpdateUsers } from "../../../application/factories/make-update-users.factory.js";
import { updateUserSchema } from "./update-users.schema.js";

export async function updateUserRoute(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'PATCH',
    url: '/:id',
    schema: updateUserSchema,
    handler: async (request, reply) => {
      const updateUser = makeUpdateUsers()
      const userId = request.params.id

      const output = await updateUser.execute(userId, request.body)
      return reply.status(204).send(output)
    }
  })
}