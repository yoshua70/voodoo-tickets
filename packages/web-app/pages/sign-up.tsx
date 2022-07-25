import { NextPage } from "next";
import SignUpForm from "../components/SignUpForm";

const SignUpPage: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white items-center justify-center gap-8">
      <h1 className="text-4xl">Inscription</h1>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
