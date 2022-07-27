import { NextPage } from "next";
import { Layout } from "../components/Layout";
import SignInForm from "../components/SignInForm";

const SignInPage: NextPage = () => {
  return (
    <Layout title="Connexion">
      <div className="flex flex-col items-center justify-center gap-8  min-h-screen">
        <h1 className="text-4xl">Connexion</h1>
        <SignInForm />
      </div>
    </Layout>
  );
};

export default SignInPage;
