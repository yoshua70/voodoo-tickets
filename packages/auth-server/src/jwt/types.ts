import { Request } from "express";

export interface JWTEncodeParams {
  userId: string;
  expiresIn: string;
  type: "access" | "refresh";
}

export interface JWTDecodeParams {
  token: string;
  type: "access" | "refresh";
}

export interface GetTokenParams {
  req: Request;
  cookieName: string;
}

export interface GetTokenReturn {
  accessToken: string | null;
  refreshToken: string | null;
}
