import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserInput, UserInputSchema } from "./UserInputSchema";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

const SignUpForm = () => {
  const [tokensCookies, setTokensCookies] = useCookies([
    "voodoo_access_token",
    "voodoo_refresh_token",
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>({
    resolver: zodResolver(UserInputSchema),
  });

  const router = useRouter();

  const createUserMutation = trpc.useMutation(["user.register"], {
    onSuccess: ({ result }) => {
      setTokensCookies(
        "voodoo_access_token",
        JSON.stringify(result.data.access_token)
      );
      setTokensCookies(
        "voodoo_refresh_token",
        JSON.stringify(result.data.refresh_token)
      );
    },
  });

  const onSubmit = async (data: UserInput) => createUserMutation.mutate(data);

  if (createUserMutation.isLoading)
    return (
      <div className="flex flex-col bg-white drop-shadow-sm p-4 text-slate-800 rounded w-sm gap-2 max-w">
        <p>Loading...</p>
      </div>
    );

  if (createUserMutation.isSuccess) router.push("/dashboard");

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
          <select
            className="bg-slate-300 rounded"
            {...register("diallingCode")}
          >
            <option>+225</option>
          </select>
          <input
            {...register("phone")}
            type="text"
            className="p-2 rounded border-slate-800 border-2 w-full"
          />
        </div>
        <p className="text-red-500">{errors.phone?.message}</p>
        <p className="text-red-500">{errors.diallingCode?.message}</p>
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
