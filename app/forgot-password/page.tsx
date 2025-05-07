'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus('✅ Reset link sent. Check your inbox.');
    } else {
      setStatus('❌ Failed to send reset link.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900 p-6 rounded-xl border border-gray-700"
      >
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-600 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full p-3 bg-white text-black rounded font-semibold hover:bg-gray-300 transition"
        >
          Send Reset Link
        </button>
        <p className="mt-4 text-sm text-center text-gray-400">{status}</p>
      </form>
    </main>
  );
}
