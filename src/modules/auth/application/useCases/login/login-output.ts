import { outputLoginSchema } from "@/modules/auth/presentation/login/index.schema.js";
import { z } from 'zod'

export type ILoginOutput = z.infer<typeof outputLoginSchema>;