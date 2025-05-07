"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-black text-black dark:text-white">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-4 py-2 rounded border dark:bg-black dark:border-gray-600"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 px-4 py-2 rounded border dark:bg-black dark:border-gray-600"
        />

        {/* Forgot password link */}
        <div className="mb-4 text-right text-sm">
          <a
            href="/forgot-password"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white dark:bg-white dark:text-black py-2 rounded hover:opacity-90"
        >
          Login
        </button>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full border px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Login with Google
          </button>

          <a
            href="/otp-login"
            className="block w-full text-center border px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Login with OTP
          </a>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
              Sign up
            </a>
          </p>
        </div>

      </form>
    </main>
  );
}
