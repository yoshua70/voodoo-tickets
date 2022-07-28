import { createReactQueryHooks } from "@trpc/react";
import { AppRouter } from "gateway/src/trpc/server";

export const trpc = createReactQueryHooks<AppRouter>();
