import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UserEmailConfirmationSchema } from "./index.schema.js";
import { confirmEmail } from "../../../container/index.js";

export async function confirmUserEmailRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/email-confirmation",
    schema: UserEmailConfirmationSchema,
    handler: async (request, reply) => {
      const token = request.body.token;
      const output = await confirmEmail.execute(token);
      return reply.status(204).send(output);
    },
  });
}
