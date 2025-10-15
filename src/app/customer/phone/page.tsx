'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PhonePage() {
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      localStorage.setItem('customerPhone', phone);
      router.push('/customer/menu');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
      <p className="text-gray-600 mb-8 text-center">Enter your phone number to start ordering</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="tel"
          placeholder="e.g. 0123456789"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 mb-4 text-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
