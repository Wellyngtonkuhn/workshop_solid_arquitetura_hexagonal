import { z } from "zod";

export const createUserOutputSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  age: z.number(),
  phoneNumber: z.string(),
  email: z.string(),
  preferredMarketingChannel: z.string(),
});

export type CreateUserOutputDTO = z.infer<typeof createUserOutputSchema> 