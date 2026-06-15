import { z } from "zod";

export const errorResponseSchema = z.object({
  error: z.string(),
});

export type ErrorResponseDTO = z.infer<typeof errorResponseSchema>;