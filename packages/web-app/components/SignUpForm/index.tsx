import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserInput, UserInputSchema } from "./UserInputSchema";
import { trpc } from "../../utils/trpc";
import { VerifyPhoneForm } from "./VerifyPhoneForm";
import { useState } from "react";
import { TRPCResponse } from "@trpc/server/rpc";

const SignUpForm = () => {
  const [userPhone, setUserPhone] = useState({ phone: "", indicatif: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>({
    resolver: zodResolver(UserInputSchema),
  });

  const verifyUserMutation = trpc.useMutation(["user.sendVerification"]);
  const createUserMutation = trpc.useMutation(["user.createUser"], {
    onSuccess: (data) => {
      verifyUserMutation.mutate(data.result.data);
    },
  });

  const onSubmit = async (data: UserInput) => {
    setUserPhone({ phone: data.phone, indicatif: data.indicatif });
    createUserMutation.mutate(data);
  };

  console.log(createUserMutation.data);

  if (createUserMutation.isLoading)
    return (
      <div className="flex flex-col bg-white drop-shadow-sm p-4 text-slate-800 rounded w-sm gap-2 max-w">
        <p>Loading...</p>
      </div>
    );

  if (createUserMutation.isSuccess)
    return (
      <VerifyPhoneForm
        phone={userPhone.phone}
        indicatif={userPhone.indicatif}
      />
    );

  return (
    <form
      className="flex flex-col bg-white drop-shadow-sm p-4 text-slate-800 rounded w-sm gap-2 max-w"
      onSubmit={handleSubmit((data) => onSubmit(data))}
    >
      <div className="flex flex-col">
        <label htmlFor="name">Nom et prénoms</label>
        <input
          {...register("name")}
          type="text"
          className="p-2 rounded border-slate-800 border-2"
        />
        <p className="text-red-500">{errors.name?.message}</p>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="name">Numéro de téléphone</label>
        <div className="flex justify-between gap-2">
          <select className="bg-slate-300 rounded" {...register("indicatif")}>
            <option>+225</option>
          </select>
          <input
            {...register("phone")}
            type="text"
            className="p-2 rounded border-slate-800 border-2 w-full"
          />
        </div>
        <p className="text-red-500">{errors.phone?.message}</p>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password">Mot de passe</label>
        <input
          {...register("password")}
          type="password"
          className="p-2 rounded border-slate-800 border-2"
        />
        <p className="text-red-500">{errors.password?.message}</p>
      </div>
      <div className="flex flex-col gap-2">
        {createUserMutation.error && (
          <p className="text-red-500">{createUserMutation.error.message}</p>
        )}
        <button
          className="p-2 bg-blue-500 text-white rounded drop-shadow-md"
          type="submit"
        >
          Inscription
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
