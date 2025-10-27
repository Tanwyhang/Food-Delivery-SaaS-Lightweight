'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import OrderCard from '@/components/OrderCard';
import { Order } from '@/lib/types';

const statusOrder = ['pending', 'paid', 'preparing', 'delivering', 'delivered'];
const nextStatus: Record<string, string> = {
  paid: 'preparing',
  preparing: 'delivering',
  delivering: 'delivered',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
  };

  const updateStatus = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || !nextStatus[order.status]) return;

    await supabase
      .from('orders')
      .update({ status: nextStatus[order.status] })
      .eq('id', orderId);
    
    fetchOrders();
  };

  const confirmPayment = async (orderId: string) => {
    await supabase
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', orderId);

    fetchOrders();
  };

  const discardOrder = async (orderId: string) => {
    await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    fetchOrders();
  };

  const batchUpdate = async () => {
    if (selected.size === 0) return;

    const updates = Array.from(selected).map((id) => {
      const order = orders.find((o) => o.id === id);
      if (!order || !nextStatus[order.status]) return null;
      return supabase
        .from('orders')
        .update({ status: nextStatus[order.status] })
        .eq('id', id);
    });

    await Promise.all(updates.filter(Boolean));
    setSelected(new Set());
    fetchOrders();
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const groupedOrders = statusOrder.reduce((acc, status) => {
    acc[status] = orders.filter((o) => o.status === status);
    return acc;
  }, {} as Record<string, Order[]>);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        {selected.size > 0 && (
          <button
            onClick={batchUpdate}
            className="bg-primary text-primary-foreground px-4 py-2 rounded font-medium hover:opacity-90"
          >
            Update {selected.size} orders
          </button>
        )}
      </div>

      {statusOrder.map((status) => (
        <div key={status} className="mb-6">
          <h2 className="font-semibold text-lg mb-3 capitalize">
            {status} ({groupedOrders[status].length})
          </h2>
          {groupedOrders[status].map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={updateStatus}
              onConfirmPayment={confirmPayment}
              onDiscard={discardOrder}
              isSelected={selected.has(order.id)}
              onSelect={toggleSelect}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
