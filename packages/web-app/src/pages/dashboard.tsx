import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useCookies } from "react-cookie";
import { Layout } from "../components/Layout";
import { parseCookie } from "../utils/parse-cookie";
import { useRouter } from "next/router";

const Dashboard: NextPage = ({
  access_token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [tokensCookies, setTokensCookies, removeTokenscookies] = useCookies([
    "voodoo_access_token",
    "voodoo_refresh_token",
  ]);

  const router = useRouter();

  const signOut = () => {
    removeTokenscookies("voodoo_access_token");
    removeTokenscookies("voodoo_refresh_token");

    router.push("/sign-in");
  };

  return (
    <Layout title="Tableau de bord">
      <div className="flex justify-between p-4">
        <h1>Tableau de bord</h1>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500 rounded"
        >
          Sign Out
        </button>
      </div>
    </Layout>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookie = parseCookie(req);

  if (!cookie.voodoo_access_token)
    return { redirect: { destination: "/sign-in" }, props: {} };

  return {
    props: { access_token: cookie.voodoo_access_token },
  };
};
