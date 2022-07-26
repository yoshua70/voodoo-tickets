import { Context } from "../trpc/context";

interface SendTokensParams {
  ctx: Context;
  accessToken?: string | null;
  refreshToken?: string | null;
}

export const sendTokens = async ({
  ctx,
  accessToken,
  refreshToken,
}: SendTokensParams) => {
  ctx.res.cookie("voodoo_access_token", accessToken, {
    httpOnly: true,
  });
  ctx.res.cookie("voodoo_refresh_token", refreshToken, {
    httpOnly: true,
  });
};

export const sendAccessToken = async ({
  ctx,
  accessToken,
}: SendTokensParams) => {
  ctx.res.cookie("voodoo_access_token", accessToken, {
    httpOnly: true,
  });
};

export const sendRefreshToken = async ({
  ctx,
  refreshToken,
}: SendTokensParams) => {
  ctx.res.cookie("voodoo_refresh_token", refreshToken, {
    httpOnly: true,
  });
};
