import { Prisma, User } from "@prisma/client";
import { encode } from "../jwt";
import { prisma } from "../utils/prisma-client";
import { FindUserParams, UpdateUserParams } from "./types";

export const createUser = async (input: Prisma.UserCreateInput) => {
  return (await prisma.user.create({
    data: input,
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

  return { access_token, refresh_token };
};
