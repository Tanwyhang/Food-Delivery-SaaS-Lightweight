'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CartItemCard from '@/components/CartItemCard';
import { CartItem } from '@/lib/types';
import { Package, Clipboard } from 'lucide-react';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Block = 'Amarin' | 'Azelia' | 'Eugenia' | 'Sierra' | 'Amaryn' | 'Azelia' | 'Eugenia' | 'Emilia' | 'Sierra' | 'Sierra Elite' | 'Sierra Prime' | 'Sierra 3A Elegant' | 'Salvia' | 'Citra' | 'Citra Elite 3' | 'Senni 3A';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [block, setBlock] = useState<Block>('Amarin');
  const [lorong, setLorong] = useState('');
  const [unit, setUnit] = useState('');
  const [hasOrder, setHasOrder] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopy = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER?.substring(1) || '123456789';
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const handlePlaceOrder = async () => {
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
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, items: cart, total, address }),
      });

      const data = await res.json();
      if (data.success) {
        const existingOrders = localStorage.getItem(`orders_${phone}`);
        const orders = existingOrders ? JSON.parse(existingOrders) : [];
        orders.push(data.orderId);
        localStorage.setItem(`orders_${phone}`, JSON.stringify(orders));
        localStorage.removeItem('cart');
        router.push('/customer/orderStatus');
      } else {
        alert('Order failed. Please try again.');
      }
    } catch {
      alert('Order failed. Please try again.');
    } finally {
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
            <Select onValueChange={(value) => setBlock(value as Block)} defaultValue={block}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a block" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectItem value="Amarin">Amarin</SelectItem>
                  <SelectItem value="Azelia">Azelia</SelectItem>
                  <SelectItem value="Eugenia">Eugenia</SelectItem>
                  <SelectItem value="Emilia">Emilia</SelectItem>
                  <SelectItem value="Sierra">Sierra</SelectItem>
                  <SelectItem value="Sierra Elite">Sierra Elite</SelectItem>
                  <SelectItem value="Sierra Prime">Sierra Prime</SelectItem>
                  <SelectItem value="Sierra 3A Elegant">Sierra 3A Elegant</SelectItem>
                  <SelectItem value="Salvia">Salvia</SelectItem>
                  <SelectItem value="Citra">Citra</SelectItem>
                  <SelectItem value="Citra Elite 3">Citra Elite 3</SelectItem>
                  <SelectItem value="Senni 3A">Senni 3A</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

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

          <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 mb-4 text-center">
            <h2 className="font-semibold mb-3">Payment</h2>
            <p className="text-sm text-muted-foreground mb-2">Please scan the QR code to pay.</p>
            <Image src={process.env.NEXT_PUBLIC_QR_CODE_URL || '/placeholder-qr.png'} alt="QR Code" width={200} height={200} className="mx-auto my-4" />
            <p className="text-sm text-muted-foreground">Or transfer to the number below:</p>
            <div className="flex justify-center items-center gap-2">
              <input type="text" value="+60" disabled className="w-16 text-center bg-muted text-muted-foreground rounded-md" />
              <input type="text" value={process.env.NEXT_PUBLIC_PHONE_NUMBER?.substring(1) || '123456789'} disabled className="flex-grow text-center bg-muted text-muted-foreground rounded-md" />
              <button onClick={handleCopy} className="p-2 bg-secondary text-secondary-foreground rounded-md">
                <Clipboard className="w-4 h-4" />
              </button>
              {copied && <span className="text-xs text-green-500">Copied!</span>}
            </div>
          </div>

          <div className="space-y-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'I have completed the payment'}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Have you completed the payment?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your order will be placed upon confirmation.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePlaceOrder}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      )}
    </div>
  );
}
