import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { Layout } from "../components/Layout";
import { parseCookie } from "../utils/parse-cookie";
import { trpc } from "../utils/trpc";

const Dashboard: NextPage = ({
  cookie,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(cookie);

  return (
    <Layout title="Tableau de bord">
      <h1>Tableau de bord</h1>
      <p>{cookie?.voodoo_access_token}</p>
      <p>{cookie?.voodoo_refresh_token}</p>
    </Layout>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookie = parseCookie(req);

  if (!cookie) return { redirect: { destination: "/sign-up" }, props: {} };

  return {
    props: { cookie },
  };
};
