"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { FormField } from "@/components/FormField";
import { ZencartaLogo } from "@/components/ZencartaLogo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const { login, register, user, isLoading: authLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "register">("signin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zencarta-green" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zencarta-green" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result =
      mode === "signin"
        ? await login(email, password)
        : await register(name, email, password);
    setLoading(false);
    if (result.ok) router.push(redirect);
    else setError(result.error ?? (mode === "signin" ? "Login failed" : "Could not create account"));
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <div className="relative hidden w-1/2 overflow-hidden bg-zencarta-navy lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-zencarta-green/30 via-transparent to-transparent" />
        <div className="relative flex h-full flex-col items-center justify-center p-12">
          <ZencartaLogo variant="dark" href={false} size="h-16" />
          <p className="mt-8 max-w-sm text-center text-lg text-slate-300">
            Shop Smart. Live Easy. Sign in to track orders, save addresses, and
            checkout faster.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <ZencartaLogo variant="auto" href="/" />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <h1 className="text-2xl font-bold text-zencarta-navy sm:text-3xl dark:text-slate-100">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="mt-2 text-sm text-zencarta-muted">
                {mode === "signin"
                  ? "New to Zencarta? Create an account in seconds."
                  : "Join Zencarta to track orders, save addresses, and checkout faster."}
              </p>
            </motion.div>
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
                {error}
              </p>
            )}
            <AnimatePresence initial={false}>
              {mode === "register" && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <FormField
                    label="Full name"
                    id="name"
                    value={name}
                    onChange={setName}
                    placeholder="Jane Doe"
                    required
                    autoComplete="name"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <FormField
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-zencarta-navy dark:text-slate-100"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-zencarta-navy outline-none focus:border-zencarta-green focus:ring-2 focus:ring-zencarta-green/20 dark:border-[#2a4530] dark:bg-[#16281b] dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zencarta-muted hover:text-zencarta-navy dark:hover:text-slate-100"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zencarta-muted">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-zencarta-green focus:ring-zencarta-green dark:border-[#2a4530]"
                />
                Remember me
              </label>
              <button
                type="button"
                className="font-medium text-zencarta-green hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zencarta-green py-3.5 text-sm font-semibold text-white uppercase transition-colors hover:bg-zencarta-green-dark disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign In" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zencarta-muted">
            {mode === "signin" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setMode("register");
                  }}
                  className="font-semibold text-zencarta-green hover:underline"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setMode("signin");
                  }}
                  className="font-semibold text-zencarta-green hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>

          <p className="mt-8 text-center text-xs text-zencarta-muted">
            <Link href="/" className="hover:text-zencarta-green">
              ← Back to store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zencarta-green" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
