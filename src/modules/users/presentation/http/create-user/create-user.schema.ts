import { z } from "zod";
import { errorResponseSchema } from "../../../../../drivers/http/errors/http-error.schema.js";
import { FastifySchema } from "fastify";

const createUserInputSchema = z.object({
  name: z.string().trim().min(1),
  age: z.number().int().min(18).max(100),
  phoneNumber: z.string().startsWith("+55", { message: 'O telefone deve começar com +55 (Brasil)' }).trim().min(1),
  email: z.email(),
  password: z.string().min(8),
  passwordConfirmation: z.string().min(8),
  preferredMarketingChannel: z.enum(["email", "sms", "push", "whatsapp"]),
});

const createUserOutputSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  age: z.number(),
  phoneNumber: z.string(),
  email: z.string(),
  preferredMarketingChannel: z.string(),
});

export const createUserRouteSchema = {
  tags: ["Users"],
  summary: "Create user",
  body: createUserInputSchema,
  response: {
    201: createUserOutputSchema,
    400: errorResponseSchema,
    409: errorResponseSchema,
    500: errorResponseSchema,
  },
} satisfies FastifySchema