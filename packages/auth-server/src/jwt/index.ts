import { JwtPayload, sign, verify } from "jsonwebtoken";
import { customConfig } from "../config/default";
import {
  JWTDecodeParams,
  JWTEncodeParams,
  GetTokenParams,
  GetTokenReturn,
} from "./types";

/**
 * Generate a JWT, either an access token or a refresh token.
 * The algorithm used by default is "HS256".
 */
export const encode = async (params: JWTEncodeParams) => {
  const { userId, expiresIn, type } = params;

  const privateKey =
    type === "access"
      ? Buffer.from(customConfig["accessTokenPrivateKey"], "base64").toString(
          "ascii"
        )
      : Buffer.from(customConfig["refreshTokenPrivateKey"], "base64").toString(
          "ascii"
        );

  return sign({ userId }, privateKey, {
    expiresIn,
    algorithm: "RS256",
  });
};

/**
 * Decode a JWT. Must provide a secret since the access
 * and refresh tokens may use different encoding secret.
 */
export const decode = async (params: JWTDecodeParams) => {
  const { token, type } = params;

  if (!token) return null;

  const publicKey =
    type === "access"
      ? Buffer.from(customConfig["accessTokenPublicKey"], "base64").toString(
          "ascii"
        )
      : Buffer.from(customConfig["refreshTokenPublicKey"], "base64").toString(
          "ascii"
        );

  return verify(token, publicKey) as JwtPayload;
};

/**
 * Returns the token contained inside a request.
 * Looks for the token inside of the cookie or in the
 * `Authorization` headers.
 */
export const getToken = async (
  params: GetTokenParams
): Promise<GetTokenReturn> => {
  const { req } = params;

  if (!req) throw new Error("Must pass `req` to JWT getToken()");

  const authorization = req.headers.authorization;

  let accessToken = "";
  let refreshToken = "";

  if (authorization?.split(" ")[0] === "Bearer") {
    accessToken = authorization.split(" ")[1];
  }

  refreshToken = req.cookies["voodoo-refresh-token"];

  return { accessToken: accessToken, refreshToken: refreshToken };
};
