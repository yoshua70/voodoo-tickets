import { TRPCError } from "@trpc/server";
import { decode, encode } from "../../jwt";
import { findUniqueUser } from "../../services/user.service";
import { Context } from "../../trpc/context";

interface RefreshAccessTokenParams {
  ctx: Context;
}

export const refreshAccessTokenController = async ({
  ctx,
}: RefreshAccessTokenParams) => {
  const refresh_token = ctx.req.cookies?.voodoo_refresh_token as string;

  const message = "Impossible de rafraîchir le jeton de rafraîchissement.";

  if (!refresh_token) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message,
    });
  }

  const payload = await decode({ token: refresh_token, type: "refresh" });

  if (!payload) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message,
    });
  }

  const user = await findUniqueUser({
    where: { id: payload.userId },
    select: { id: true },
  });

  const access_token = await encode({
    type: "access",
    expiresIn: "15m",
    userId: user.id,
  });

  return {
    id: null,
    result: {
      type: "data",
      data: { access_token },
    },
  };
};
