import { FastifySchema } from "fastify";
import z from "zod";
import { errorResponseSchema } from "../../../../../drivers/http/errors/http-error.schema.js";

export const inputSchema = z.object({
  token: z.string().min(1)
})

export const UserEmailConfirmationSchema = {
  tags: ["Users"],
  summary: 'Confirm User Email',
  body: inputSchema,
  response: {
    204: z.void(),
    400: errorResponseSchema,
    401: errorResponseSchema,
    404: errorResponseSchema,
    409: errorResponseSchema,
    410: errorResponseSchema,
    500: errorResponseSchema
  }
} satisfies FastifySchema