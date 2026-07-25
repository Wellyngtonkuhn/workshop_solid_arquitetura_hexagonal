import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { createUserRouteSchema } from "./create-user.schema.js";
import { createUser } from "../../../container/index.js";

export async function createUserRoute(app: FastifyInstance) {  
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: createUserRouteSchema,
    handler: async (request, reply) => {
      const output = await createUser.execute(request.body);
      return reply.status(201).send(output);
    },
  });
}
