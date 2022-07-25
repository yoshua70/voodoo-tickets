import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "../../utils/trpc";
import {
  PhoneVerificationInput,
  PhoneVerificationInputSchema,
} from "./UserInputSchema";

interface VerifyPhoneFormComponent {
  phone: string;
  indicatif: string;
}

export const VerifyPhoneForm = ({
  phone,
  indicatif,
}: VerifyPhoneFormComponent) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneVerificationInput>({
    resolver: zodResolver(PhoneVerificationInputSchema),
  });

  const verifyUserMutation = trpc.useMutation(["user.verify"]);

  const onSubmit = async (data: PhoneVerificationInput) => {
    console.log(data);
    verifyUserMutation.mutate({
      phone: phone,
      code: parseInt(data.code),
      indicatif: indicatif,
    });
  };

  if (verifyUserMutation.isLoading)
    return (
      <div className="flex flex-col bg-white drop-shadow-sm p-4 text-slate-800 rounded w-sm gap-2 max-w">
        <p>Loading...</p>
      </div>
    );

  if (verifyUserMutation.isSuccess) {
    console.log(verifyUserMutation.data);
    return (
      <div className="flex flex-col bg-white drop-shadow-sm p-4 text-slate-800 rounded w-sm gap-2 max-w">
        <p>Succès.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white drop-shadow-sm p-4 text-slate-800 rounded w-sm gap-2 max-w">
      <form
        className="flex flex-col bg-white drop-shadow-sm p-4 text-slate-800 rounded w-sm gap-2 max-w"
        onSubmit={handleSubmit((data) => onSubmit(data))}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name">
            Entrez le code reçu sur votre numéro de téléphone
          </label>
          <input
            {...register("code")}
            type="text"
            className="p-2 rounded border-slate-800 border-2"
          />
          <p className="text-red-500">{errors.code?.message}</p>
        </div>

        <div className="flex flex-col gap-2">
          {verifyUserMutation.error && (
            <p className="text-red-500">{verifyUserMutation.error.message}</p>
          )}
          <button
            className="p-2 bg-blue-500 text-white rounded drop-shadow-md"
            type="submit"
          >
            Inscription
          </button>
        </div>
      </form>
    </div>
  );
};
