import { TRPCError } from "@trpc/server";
import { RegisterUserInput } from "../../schemas/user.schema";
import {
  createUser,
  findUser,
  generateTokens,
} from "../../services/user.service";
import argon2 from "argon2";

/**
 * Register a user with the phone number, dialling code and name.
 * Search if a user with the same phone number and dialling code already exits.
 * Return access and refresh tokens for the created user.
 */
export const registerController = async (params: RegisterUserInput) => {
  let user = await findUser({
    where: { phone: params.phone, diallingCode: params.diallingCode },
  });

  if (user) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Ce numéro est déjà enregistré.",
    });
  }

  const hashedPassword = await argon2.hash(params.password);

  user = await createUser({
    ...params,
    password: hashedPassword,
  });

  const { access_token, refresh_token } = await generateTokens(user.id);

  return {
    id: null,
    result: {
      type: "data",
      data: {
        access_token,
        refresh_token,
      },
    },
  };
};
