import { errorResponseSchema } from "@/drivers/http/errors/http-error.schema.js";
import { FastifySchema } from "fastify";
import { z } from 'zod'

export const inputSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
})

export const outputSchema = z.object({
  token: z.string()
})

export const LoginSchema = {
  tags: ["Login"],
  summary: "Login",
  body: inputSchema,
  response: {
    200: outputSchema,
    400: errorResponseSchema,
    401: errorResponseSchema,
    403: errorResponseSchema,
    429: errorResponseSchema,
    500: errorResponseSchema,
  }
} satisfies FastifySchema