import { encode } from "../jwt";
import { Context } from "../trpc/context"

interface SendTokensParams {
  ctx: Context,
  userId: string;
}

export const sendTokens = async ({ctx, userId}: SendTokensParams) => {
  const accessToken = await encode({type: "access", userId, expiresIn: "15m"})
  const refreshToken = await encode({type: "refresh", userId, expiresIn: "7d"})

  ctx.res.cookie("voodoo-access-token", accessToken, {
    httpOnly: true,
  });
  ctx.res.cookie("voodoo-refresh-token", refreshToken, {
    httpOnly: true,
  });
}