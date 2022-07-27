import { z } from "zod";

/**
 * To register an user, we need the name, phone, password and dialling code
 * associated with the user's location.
 * The phone number and dialling code form a unique key for the user.
 */
export const registerUserSchema = z.object({
  name: z.string().min(5),
  phone: z.string().min(10),
  password: z.string().min(8),
  diallingCode: z.string().min(1),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({
  phone: z.string().min(10),
  password: z.string().min(8),
  diallingCode: z.string().min(1),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
