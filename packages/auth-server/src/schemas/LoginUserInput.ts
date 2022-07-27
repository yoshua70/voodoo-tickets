import { z } from "zod";

export const loginUserInputSchema = z.object({
  phone: z.string().min(10),
  password: z.string().min(8),
  diallingCode: z.string().min(1),
});

export type LoginUserInput = z.infer<typeof loginUserInputSchema>;
