"use client";
import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/register", { email, password });
      await signIn("credentials", { email, password, callbackUrl: "/" });
    } catch (err: unknown) {
      // Safely check for axios error shape
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as any).response?.data?.error === "string"
      ) {
        setError((err as any).response.data.error);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-black text-black dark:text-white">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Create an Account</h1>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full mb-3 px-4 py-2 rounded border dark:bg-black dark:border-gray-600"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full mb-3 px-4 py-2 rounded border dark:bg-black dark:border-gray-600"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white dark:bg-white dark:text-black py-2 rounded hover:opacity-90"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
    </main>
  );
}
