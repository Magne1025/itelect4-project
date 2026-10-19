import { useNavigate, Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "../store/authStore";
import { loginUser } from "../api/client";
import { loginSchema, type LoginFormValues } from "../schemas/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginPage() {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const logIn = useMutation({
    mutationFn: loginUser,
    onSuccess: (reply) => {
      setSession(reply.token, reply.user.name, reply.user);
      navigate("/items");
    },
  });

  const onSubmit = (values: LoginFormValues): void => {
    logIn.mutate(values);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-white/[0.08] shadow-2xl">
        <h2 className="mb-2 text-2xl font-bold font-heading text-gray-900 dark:text-white">
          Sign In
        </h2>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Enter your credentials to access your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div className="grid gap-1.5">
            <Label htmlFor="email" className="text-foreground text-sm font-semibold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              aria-invalid={errors.email ? true : undefined}
              placeholder="juan@dlsl.edu.ph"
              className="rounded-xl"
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="password" className="text-foreground text-sm font-semibold">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              aria-invalid={errors.password ? true : undefined}
              className="rounded-xl"
            />
            {errors.password && (
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={logIn.isPending}
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold"
          >
            {logIn.isPending ? "Signing in..." : "Log In"}
          </Button>
        </form>

        {logIn.isError && (
          <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-xl border border-red-200 dark:border-red-900/30">
            {logIn.error.message}
          </p>
        )}

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          No account yet?{" "}
          <Link to="/register" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
