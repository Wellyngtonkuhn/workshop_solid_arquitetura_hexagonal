import { errorResponseSchema } from "@/drivers/http/errors/http-error.schema.js";
import { FastifySchema } from "fastify";
import { z } from 'zod'

export const inputSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
})

export const outputLoginSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.email(),
    name: z.string(),
  }),

  token: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
  }),
})

export const LoginSchema = {
  tags: ["Login"],
  summary: "Login",
  body: inputSchema,
  response: {
    200: outputLoginSchema,
    400: errorResponseSchema,
    401: errorResponseSchema,
    403: errorResponseSchema,
    429: errorResponseSchema,
    500: errorResponseSchema,
  }
} satisfies FastifySchema