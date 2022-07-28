import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc/server";
import { createContext } from "./trpc/context";
import cookieParser from "cookie-parser";
import Cors from "cors";

const main = async () => {
  const cors = Cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  });

  const app = express();

  app.use(cors);
  app.use(cookieParser());

  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({ router: appRouter, createContext })
  );

  app.listen(8080, () => {
    console.log("[INFO] API gateway up and running on port 8080");
  });
};

main().catch((err) => console.error(err));
