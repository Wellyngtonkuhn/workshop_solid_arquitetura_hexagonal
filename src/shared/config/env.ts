import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().default(3000),
  ACCESS_TOKEN_EXPIRES_IN: z.coerce.number().default(15),
  REFRESH_TOKEN_EXPIRES_IN: z.coerce.number().default(10080)
});

export const env = envSchema.parse(process.env);