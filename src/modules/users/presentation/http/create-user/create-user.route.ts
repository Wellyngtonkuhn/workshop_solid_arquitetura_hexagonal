import { ZodTypeProvider } from "fastify-type-provider-zod";
import { makeCreateUser } from "../../../application/factories/make-create-users.factory.js";
import { FastifyInstance } from "fastify";
import { createUserRouteSchema } from "./create-user.schema.js";

export async function createUserRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: createUserRouteSchema,

    handler: async (request, reply) => {
      const createUser = makeCreateUser();

      const output = await createUser.execute(request.body);

      return reply.status(201).send(output);
    },
  });
}
