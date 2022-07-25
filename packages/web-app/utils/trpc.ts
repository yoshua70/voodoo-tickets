import { createReactQueryHooks } from "@trpc/react";
import { AppRouter } from "auth-server/src/trpc/server";

export const trpc = createReactQueryHooks<AppRouter>();
