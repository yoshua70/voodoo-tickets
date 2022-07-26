import "dotenv/config";

interface CustomConfig {
  accessTokenPrivateKey: string;
  accessTokenPublicKey: string;

  refreshTokenPrivateKey: string;
  refreshTokenPublicKey: string;

  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export const customConfig: CustomConfig = {
  accessTokenExpiresIn: 15,
  refreshTokenExpiresIn: 60,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY as string,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY as string,
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY as string,
};
