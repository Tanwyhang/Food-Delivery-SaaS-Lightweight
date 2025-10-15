'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CartItemCard from '@/components/CartItemCard';
import { CartItem } from '@/lib/types';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const handleRemove = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayNow = async () => {
    const phone = localStorage.getItem('customerPhone');
    if (!phone) {
      router.push('/customer/phone');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/createBill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, items: cart, total }),
      });

      const data = await res.json();
      if (data.success) {
        // PROTOTYPE: Show success message
        console.log('✅ Payment Success:', data.message);
        
        localStorage.setItem('currentOrderId', data.orderId);
        localStorage.removeItem('cart');
        
        // Redirect to order status page (no external payment gateway)
        router.push('/customer/orderStatus');
      } else {
        alert('Order failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      alert('Order failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      
      {cart.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">Your cart is empty</p>
      ) : (
        <>
          {cart.map((item, idx) => (
            <CartItemCard key={idx} item={item} onRemove={() => handleRemove(idx)} />
          ))}

          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span className="text-blue-600">RM {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePayNow}
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </>
      )}
    </div>
  );
}
