import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UserEmailConfirmationSchema } from "./index.schema.js";
import { makeConfirmUserEmail } from "../../../application/factories/make-confirm-user-email.factory.js";

export async function confirmUserEmailRoute(app: FastifyInstance) {
  const confirmEmail = makeConfirmUserEmail()
  
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/email-confirmation",
    schema: UserEmailConfirmationSchema,
    handler: async (request, reply) => {
      const token = request.body.token
      const output = await confirmEmail.execute(token)
      return reply.status(204).send(output)
    }
  })
}