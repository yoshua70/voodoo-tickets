import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { trpc } from "../../utils/trpc";
import { UserLogin, UserLoginSchema } from "../SignUpForm/UserInputSchema";

const SignInForm = () => {
  const [tokensCookies, setTokensCookies, removeTokenscookies] = useCookies([
    "voodoo_access_token",
    "voodoo_refresh_token",
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLogin>({
    resolver: zodResolver(UserLoginSchema),
  });

  const router = useRouter();

  const loginUserMutation = trpc.useMutation(["user.login"], {
    onSuccess: ({ result }) => {
      setTokensCookies(
        "voodoo_access_token",
        JSON.stringify(result.data.access_token)
      );
      setTokensCookies(
        "voodoo_refresh_token",
        JSON.stringify(result.data.refresh_token)
      );
      console.log(tokensCookies);
    },
  });

  const onSubmit = async (data: UserLogin) => loginUserMutation.mutate(data);

  if (loginUserMutation.isLoading)
    return (
      <div className="flex flex-col bg-white drop-shadow-sm p-4 text-slate-800 rounded w-sm gap-2 max-w">
        <p>Loading...</p>
      </div>
    );

  if (loginUserMutation.isSuccess) router.push("/dashboard");

  return (
    <form
      className="flex flex-col bg-white drop-shadow-sm p-4 text-slate-800 rounded w-sm gap-2 max-w"
      onSubmit={handleSubmit((data) => onSubmit(data))}
    >
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
        {loginUserMutation.error && (
          <p className="text-red-500">{loginUserMutation.error.message}</p>
        )}
        <button
          className="p-2 bg-blue-500 text-white rounded drop-shadow-md"
          type="submit"
        >
          Connexion
        </button>
      </div>
    </form>
  );
};

export default SignInForm;
