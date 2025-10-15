'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem('adminAuth', 'true');
      router.push('/admin/orders');
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-800 to-gray-900">
      <h1 className="text-3xl font-bold mb-2 text-white">Admin Login</h1>
      <p className="text-gray-300 mb-8">Enter password to continue</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-2 border-gray-600 rounded-lg px-4 py-3 mb-4 text-lg bg-gray-700 text-white"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
