import { Prisma } from "@prisma/client";

export interface FindUserParams {
  where: Partial<Prisma.UserCreateInput>;
  select?: Prisma.UserSelect;
}

export interface UpdateUserParams extends FindUserParams {
  data: Prisma.UserUpdateInput;
}
