import { z } from "zod";

export const createUserInputSchema = z.object({
  name: z.string().trim().min(1),
  age: z.number().int().min(18).max(100),
  phoneNumber: z.string().startsWith("+55").trim().min(1),
  email: z.email(),
  password: z.string().min(8),
  passwordConfirmation: z.string().min(8),
  preferredMarketingChannel: z.enum(["email", "sms", "push", "whatsapp"]),
});

export type CreateUserInputDTO = z.infer<typeof createUserInputSchema>;
