import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appAuthRouter } from "./trpc/server";
import { createContext } from "./trpc/context";
import cookieParser from "cookie-parser";
import Cors from "cors";

const main = async () => {
  const cors = Cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:8080"],
  });

  const app = express();

  app.use(cors);
  app.use(cookieParser());

  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: appAuthRouter,
      createContext,
    })
  );

  app.listen(4000, () => {
    console.log("[INFO] Server up and running on port 4000.");
  });
};

main().catch((err) => console.error(err));
