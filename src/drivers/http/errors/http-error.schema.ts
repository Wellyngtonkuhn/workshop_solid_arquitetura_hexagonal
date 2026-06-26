import { z } from "zod";

export const validationDetailSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string(),
});

export const errorResponseSchema = z.object({
  statusCode: z.number(),

  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(validationDetailSchema).optional(),
  }),
});

export type HttpErrorResponse = z.infer<typeof errorResponseSchema>;