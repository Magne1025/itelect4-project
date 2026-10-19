import { useNavigate, Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "../store/authStore";
import { registerUser, loginUser } from "../api/client";
import { registerSchema, type RegisterFormValues } from "../schemas/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterPage() {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", password: "" },
  });

  const signUp = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      await registerUser(values);
      return loginUser({ email: values.email, password: values.password });
    },
    onSuccess: (reply) => {
      setSession(reply.token, reply.user.name, reply.user);
      navigate("/items");
    },
  });

  const onSubmit = (values: RegisterFormValues): void => {
    signUp.mutate(values);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm glass-panel p-8 rounded-3xl border border-slate-200/50 dark:border-white/[0.08] shadow-2xl">
        <h2 className="mb-2 text-2xl font-bold font-heading text-gray-900 dark:text-white">
          Create Account
        </h2>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Sign up to report and track lost &amp; found items
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div className="grid gap-1.5">
            <Label htmlFor="name" className="text-foreground text-sm font-semibold">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              aria-invalid={errors.name ? true : undefined}
              placeholder="Juan dela Cruz"
              className="rounded-xl"
            />
            {errors.name && (
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

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
            disabled={signUp.isPending}
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold"
          >
            {signUp.isPending ? "Creating account..." : "Register"}
          </Button>
        </form>

        {signUp.isError && (
          <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-xl border border-red-200 dark:border-red-900/30">
            {signUp.error.message}
          </p>
        )}

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
