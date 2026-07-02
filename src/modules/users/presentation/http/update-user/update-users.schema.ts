import { FastifySchema } from "fastify";
import z from "zod";
import { errorResponseSchema } from "../../../../../drivers/http/errors/http-error.schema.js";

const params = z.object({
  id: z.uuid()
})

const inputSchema = z.object({
  name: z.string().trim().min(1),
  age: z.number().int().min(18).max(100),
  phoneNumber: z.string().regex( /^\+55\d{10,11}$/, "Telefone deve estar no formato +5511999999999").trim().min(1),
  preferredMarketingChannel: z.enum(["email", "sms", "push", "whatsapp"]),
})

const outputSchema = z.void()

export const updateUserSchema = {
  tags: ['Users'],
  summary: 'Update User',
  params,
  body: inputSchema,
  response: {
    204: outputSchema,
    400: errorResponseSchema,
    401: errorResponseSchema,
    403: errorResponseSchema,
    404: errorResponseSchema,
    409: errorResponseSchema,
  }
} satisfies FastifySchema