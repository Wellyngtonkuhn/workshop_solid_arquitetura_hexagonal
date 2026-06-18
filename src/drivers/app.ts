import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";
import { EmailAlreadyExistsError, InvalidMarketingPreferredChannelError, PasswordDoNotMatchError } from "../application/errors/index.js";
import { makeCreateUser } from "../application/factories/make-create-users.factory.js";
import { createUserInputSchema } from "../application/useCases/create-user/create-user-input.js";
import { createUserOutputSchema } from "../application/useCases/create-user/create-user-output.js";
import { errorResponseSchema } from "../application/dtos/common/error-response.js";

export const buildApp = () => {
  const app = Fastify();

  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.status(400).send({
        error: "Validation Error",
        details: error.validation,
      });
    }

    return reply.status(error.statusCode ?? 500).send({
      error: error.message,
    });
    }
  );

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Workshop Solid",
        description: "Teste",
        version: "1.0.0",
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "docs",
  });

  app.after(() => {
    app.withTypeProvider<ZodTypeProvider>().route({
      method: "POST",
      url: "/users",
      schema: {
        body: createUserInputSchema,
        response: {
          201: createUserOutputSchema,
          400: errorResponseSchema,
          409: errorResponseSchema,
          500: errorResponseSchema,
        },
      },
      handler: async (request, reply) => {
        try {
          const createUser = makeCreateUser()
          const output = await createUser.execute(request.body)
          return reply.status(201).send(output)
        } catch (error) {

          if (error instanceof PasswordDoNotMatchError) {
            return reply.status(400).send({ error: "Passwords do not match" });
          }
          if (error instanceof EmailAlreadyExistsError) {
            return reply.status(409).send({ error: "E-mail já cadastrado" });
          }
          if (error instanceof InvalidMarketingPreferredChannelError) {
            return reply
              .status(400)
              .send({ error: "Invalid marketing preferred channel" });
          }
          // return reply.status(500).send({ error: "Erro ao criar usuário" });
          return reply.status(500).send({
            error: error instanceof Error
              ? error.message
              : "Erro desconhecido"
          })
        }
      },
    });
  });

  return app;
};
