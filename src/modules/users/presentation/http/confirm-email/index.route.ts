import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UserEmailConfirmationSchema } from "./index.schema.js";
import { makeConfirmUserEmail } from "../../../application/factories/make-confirm-user-email.factory.js";

export async function confirmUserEmail(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/users/email-confirmation",
    schema: UserEmailConfirmationSchema,
    handler: async (request, reply) => {
      const confirmEmail = makeConfirmUserEmail()
      const token = request.body.token
      const output = await confirmEmail.excute(token)
      return reply.status(204).send(output)
    }
  })
}