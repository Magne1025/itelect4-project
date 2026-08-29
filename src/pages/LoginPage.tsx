import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Login page — simple form that calls authStore.login(token).
 * Redirects to / after successful login.
 * Route: /login
 */
export function LoginPage() {
  const { token, login } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Already logged in — redirect
  if (token) {
    navigate("/", { replace: true });
    return null;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    // Simulate auth — generate a mock JWT-like token
    const mockToken = btoa(`${email}:${Date.now()}`);
    login(mockToken);
    navigate("/");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-purple-500/20">
              🔐
            </div>
            <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sign in to access Claims and Users management.
            </p>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="login-email"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Email
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="admin@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="login-password"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Password
              </Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Enter any password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60 transition-all"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3 h-auto text-sm font-bold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all active:scale-[0.98] border-none"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 dark:text-slate-500">
            Use any email &amp; password — this is a mock login for GT2.
          </p>
        </div>
      </div>
    </div>
  );
}
