import { z } from "zod";

export const createUserInputSchema = z.object({
  name: z.string().min(5),
  phone: z.string().min(10),
  password: z.string().min(8),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
