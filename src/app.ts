import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "./db/client.js";
import { usersTable } from "./db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const buildApp = () => {
  const app = Fastify();

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
        body: z.object({
          name: z.string().trim().min(1),
          age: z.number().int().min(18).max(100),
          phoneNumber: z.string().startsWith("+55").trim().min(1),
          email: z.email(),
          password: z.string().min(8),
          passwordConfirmation: z.string().min(8),
          preferredMarketingChannel: z.enum(["email", "sms", "push", "whatsapp"]),
        }),
        response: {
          201: z.object({
            id: z.uuid(),
          }),
          400: z.object({
            error: z.string(),
          }),
          409: z.object({
            error: z.string(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
      handler: async (request, reply) => {
        try {
          const { body } = request;

          if (body.password !== body.passwordConfirmation) {
            return reply.status(400).send({ error: "PassWord does not match" });
          }

          const [existingUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, body.email));

          if (existingUser) {
            return reply.status(409).send({ error: "E-mail já cadastrado" });
          }

          const [userCreated] = await db
            .insert(usersTable)
            .values({
              name: body.name,
              age: body.age,
              email: body.email,
              password: await bcrypt.hash(body.password, 10),
              phoneNumber: body.phoneNumber,
              proferredMarketingChannel: body.preferredMarketingChannel,
            })
            .returning();

          if (!userCreated) {
            return reply.status(500).send({ error: "Erro ao criar usuário" });
          }

          return reply.status(201).send({ id: userCreated.id });
        } catch (error) {
          console.error(">>> Internal Error", error);
          return reply.status(500).send({ error: "Internal Error" });
        }
      },
    });
  });

  return app;
};
