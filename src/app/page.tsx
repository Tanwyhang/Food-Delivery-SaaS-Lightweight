import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-4xl font-bold mb-2 text-center">Mom's Delivery</h1>
      <p className="text-gray-600 mb-12 text-center">Choose your role to continue</p>
      
      <div className="w-full max-w-md space-y-4">
        <Link
          href="/customer/phone"
          className="block w-full bg-blue-600 text-white py-6 rounded-lg text-center font-semibold text-xl hover:bg-blue-700 transition"
        >
          🛍️ Customer
        </Link>
        
        <Link
          href="/admin/login"
          className="block w-full bg-gray-800 text-white py-6 rounded-lg text-center font-semibold text-xl hover:bg-gray-900 transition"
        >
          👩💼 Admin
        </Link>
      </div>
    </div>
  );
}
