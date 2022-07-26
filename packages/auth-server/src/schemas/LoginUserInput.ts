import { z } from "zod";

export const loginUserInputSchema = z.object({
  name: z.string().min(5),
  phone: z.string().min(10),
  password: z.string().min(8),
});

export type LoginUserInput = z.infer<typeof loginUserInputSchema>;
