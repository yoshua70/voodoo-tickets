import { TRPCError } from "@trpc/server";
import argon2 from "argon2";
import { LoginUserInput } from "../../schemas/user.schema";
import { findUniqueUser, generateTokens } from "../../services/user.service";
import { Context } from "../../trpc/context";

interface LoginControllerParams {
  input: LoginUserInput;
  ctx: Context;
}

export const loginController = async ({
  input,
  ctx,
}: LoginControllerParams) => {
  let user = await findUniqueUser({
    where: {
      phone: input.phone,
      diallingCode: input.diallingCode,
    },
  });

  // Check if the user exists and the password provided is the correct one.
  if (!user || !(await argon2.verify(user.password, input.password))) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Identifiants invalides",
    });
  }

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
