'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OTPLoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending OTP...');
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus('✅ OTP sent. Check your email.');
      setStep('otp');
    } else {
      setStatus('❌ Failed to send OTP.');
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Verifying...');
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    if (res.ok) {
      setStatus('✅ Logged in successfully.');
      setTimeout(() => router.push('/'), 1000);
    } else {
      setStatus('❌ Invalid OTP.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <form
        onSubmit={step === 'email' ? requestOtp : verifyOtp}
        className="w-full max-w-sm bg-gray-900 p-6 rounded-xl border border-gray-700"
      >
        <h1 className="text-2xl font-bold mb-4">OTP Login</h1>

        {step === 'email' ? (
          <>
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
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-3 mb-4 rounded bg-gray-800 border border-gray-600 text-white"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full p-3 bg-white text-black rounded font-semibold hover:bg-gray-300 transition"
            >
              Verify OTP
            </button>
          </>
        )}

        <p className="mt-4 text-sm text-center text-gray-400">{status}</p>
      </form>
    </main>
  );
}
