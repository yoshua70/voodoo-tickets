import { z } from "zod";

export const UserInputSchema = z.object({
  name: z.string().min(3, { message: "Entrez un nom valide." }),
  phone: z.string().length(10, {
    message: "Le numéro de téléphone doit comporter dix chiffres.",
  }),
  password: z.string().min(8, { message: "Entrez un mot de passe plus long." }),
  indicatif: z.string().min(1),
});

export type UserInput = z.infer<typeof UserInputSchema>;

export const PhoneVerificationInputSchema = z.object({
  code: z.string().length(6, {
    message: "Entrez un code valide.",
  }),
});

export type PhoneVerificationInput = z.infer<
  typeof PhoneVerificationInputSchema
>;
