import { NextPage } from "next";
import { Layout } from "../components/Layout";
import SignUpForm from "../components/SignUpForm";

const SignUpPage: NextPage = () => {
  return (
    <Layout title="Inscription">
      <div className="flex flex-col items-center justify-center gap-8  min-h-screen">
        <h1 className="text-4xl">Inscription</h1>
        <SignUpForm />
      </div>
    </Layout>
  );
};

export default SignUpPage;
