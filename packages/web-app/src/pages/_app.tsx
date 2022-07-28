import "../styles/globals.css";
import { AppType } from "next/dist/shared/lib/utils";
import { AppRouter } from "auth-server/src/trpc/server";
import { withTRPC } from "@trpc/next";
import { CookiesProvider } from "react-cookie";

const App: AppType = ({ Component, pageProps }) => {
  return (
    <CookiesProvider>
      <Component {...pageProps} />;
    </CookiesProvider>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = "http://localhost:8080/trpc";

    return {
      url,
      headers() {
        return {
          ...ctx?.req?.headers,
        };
      },
    };
  },

  ssr: true,
})(App);
