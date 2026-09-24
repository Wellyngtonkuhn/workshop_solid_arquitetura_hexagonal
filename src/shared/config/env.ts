import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().default(3000),
  ACCESS_TOKEN_EXPIRES_IN: z.coerce.number().default(15),
  REFRESH_TOKEN_EXPIRES_IN: z.coerce.number().default(10080)
});

const parsed = envSchema.safeParse(process.env);

if(!parsed.success){
  console.error('Invalid environment variables:')
  console.error(z.prettifyError(parsed.error))
  process.exit(1)
}

export const env = parsed.data