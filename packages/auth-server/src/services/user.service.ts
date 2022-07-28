import { Prisma, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { encode } from "../jwt";
import prisma from "../utils/prisma-client";
import { DeleteUserParams, FindUserParams, UpdateUserParams } from "./types";

export const createUser = async (input: Prisma.UserCreateInput) => {
  return (await prisma.user.create({
    data: input,
    select: {
      id: true,
      name: true,
      phone: true,
      verified: true,
      diallingCode: true,
      createdAt: true,
    },
  })) as User;
};

export const findUser = async ({ where, select }: FindUserParams) => {
  return (await prisma.user.findFirst({
    where,
    select,
  })) as User;
};

export const findUniqueUser = async ({ where, select }: FindUserParams) => {
  return (await prisma.user.findUnique({
    where,
    select,
  })) as User;
};

export const updateUser = async ({ where, data, select }: UpdateUserParams) => {
  return await prisma.user.update({ where, data, select });
};

export const deleteUser = async ({ where }: DeleteUserParams) => {
  const user = await prisma.user.delete({ where });

  if (!user)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Aucun utilisateur trouvé.",
    });

  return {
    id: null,
    result: {
      type: "data",
      data: "success",
    },
  };
};

export const generateTokens = async (userId: string) => {
  const access_token = await encode({
    userId,
    type: "access",
    expiresIn: "15m",
  });
  const refresh_token = await encode({
    userId,
    type: "refresh",
    expiresIn: "7d",
  });

  if (!access_token || !refresh_token)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to generate tokens",
    });

  return { access_token, refresh_token };
};
