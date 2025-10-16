'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import StatusProgressBar from '@/components/StatusProgressBar';
import OrderCard from '@/components/OrderCard';
import { Order } from '@/lib/types';

export default function OrderStatusPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const phone = localStorage.getItem('customerPhone');
    if (!phone) return;
    
    const ordersData = localStorage.getItem(`orders_${phone}`);
    if (!ordersData) {
      setLoading(false);
      return;
    }
    
    const orderIds = JSON.parse(ordersData);
    if (orderIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .in('id', orderIds)
        .order('created_at', { ascending: false });
      
      if (data) setOrders(data);
      setLoading(false);
    };

    fetchOrders();

    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="space-y-4">
            <StatusProgressBar currentStatus={order.status} />
            <OrderCard order={order} />
          </div>
        ))}
      </div>
    </div>
  );
}
