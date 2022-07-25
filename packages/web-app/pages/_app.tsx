import "../styles/globals.css";
import { AppType } from "next/dist/shared/lib/utils";
import { AppRouter } from "auth-server/src/trpc/server";
import { withTRPC } from "@trpc/next";

const App: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = "http://localhost:4000/trpc";

    return {
      url,
    };
  },

  ssr: true,
})(App);
