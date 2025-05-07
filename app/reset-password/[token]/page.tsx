'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Resetting...');

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: params.token, password }),
    });

    if (res.ok) {
      setStatus('✅ Password reset. Redirecting...');
      setTimeout(() => router.push('/login'), 2000);
    } else {
      setStatus('❌ Failed to reset password.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900 p-6 rounded-xl border border-gray-700"
      >
        <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-600 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full p-3 bg-white text-black rounded font-semibold hover:bg-gray-300 transition"
        >
          Reset Password
        </button>
        <p className="mt-4 text-sm text-center text-gray-400">{status}</p>
      </form>
    </main>
  );
}
