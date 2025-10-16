'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import StatusProgressBar from '@/components/StatusProgressBar';
import { Order } from '@/lib/types';

export default function OrderStatusPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orderId = localStorage.getItem('currentOrderId');
    if (!orderId) return;

    const fetchOrder = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (data) setOrder(data);
    };

    fetchOrder();

    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => setOrder(payload.new as Order)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Order Status</h1>
      
      <StatusProgressBar currentStatus={order.status} />

      <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6 mt-8">
        <h2 className="font-semibold mb-4">Order Details</h2>
        {order.items.map((item, idx) => (
          <p key={idx} className="mb-2">
            {item.quantity}x {item.name}
            {item.remarks && <span className="text-muted-foreground"> ({item.remarks})</span>}
          </p>
        ))}
        {order.address && (
          <div className="mt-4 pt-4 border-t">
            <p className="font-semibold mb-1">Delivery Address:</p>
            <p className="text-muted-foreground">
              {order.address.block}, Lorong {order.address.lorong}, Unit {order.address.unit}
            </p>
          </div>
        )}
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">RM {order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
