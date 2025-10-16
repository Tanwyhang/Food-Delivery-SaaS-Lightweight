'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CartItemCard from '@/components/CartItemCard';
import { CartItem } from '@/lib/types';
import { Package } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [block, setBlock] = useState<'Amarin' | 'Azelia' | 'Eugenia' | 'Sierra'>('Amarin');
  const [lorong, setLorong] = useState('');
  const [unit, setUnit] = useState('');
  const [hasOrder, setHasOrder] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
    
    const phone = localStorage.getItem('customerPhone');
    if (phone) {
      const orders = localStorage.getItem(`orders_${phone}`);
      setHasOrder(!!orders);
    }
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

    if (!lorong || !unit) {
      alert('Please fill in address details');
      return;
    }

    const address = {
      block,
      lorong: parseInt(lorong),
      unit,
    };

    setLoading(true);
    try {
      const res = await fetch('/api/createBill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, items: cart, total, address }),
      });

      const data = await res.json();
      if (data.success) {
        // PROTOTYPE: Show success message
        console.log('✅ Payment Success:', data.message);
        
        const existingOrders = localStorage.getItem(`orders_${phone}`);
        const orders = existingOrders ? JSON.parse(existingOrders) : [];
        orders.push(data.orderId);
        localStorage.setItem(`orders_${phone}`, JSON.stringify(orders));
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
    <div className="min-h-screen bg-background p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cart</h1>
        <button
          onClick={() => router.push('/customer/orderStatus')}
          disabled={!hasOrder}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-secondary text-secondary-foreground hover:opacity-90"
        >
          <Package className="w-4 h-4" /> View Order
        </button>
      </div>
      
      {cart.length === 0 ? (
        <p className="text-center text-muted-foreground mt-8">Your cart is empty</p>
      ) : (
        <>
          {cart.map((item, idx) => (
            <CartItemCard key={idx} item={item} onRemove={() => handleRemove(idx)} />
          ))}

          <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 mb-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">RM {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 mb-4">
            <h2 className="font-semibold mb-3">Delivery Address</h2>
            
            <label className="block text-sm mb-1">Block *</label>
            <select
              value={block}
              onChange={(e) => setBlock(e.target.value as any)}
              className="w-full border border-input bg-background rounded px-3 py-2 mb-3"
            >
              <option value="Amarin">Amarin</option>
              <option value="Azelia">Azelia</option>
              <option value="Eugenia">Eugenia</option>
              <option value="Sierra">Sierra</option>
            </select>

            <label className="block text-sm mb-1">Lorong *</label>
            <input
              type="number"
              placeholder="e.g. 1"
              value={lorong}
              onChange={(e) => setLorong(e.target.value)}
              className="w-full border border-input bg-background rounded px-3 py-2 mb-3"
              required
            />

            <label className="block text-sm mb-1">Unit Number *</label>
            <input
              type="text"
              placeholder="e.g. 666"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full border border-input bg-background rounded px-3 py-2"
              required
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={handlePayNow}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
