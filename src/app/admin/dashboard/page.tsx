'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import DashboardStats from '@/components/DashboardStats';
import { Order } from '@/lib/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    ordersByStatus: {
      paid: 0,
      preparing: 0,
      delivering: 0,
      delivered: 0,
    },
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data: orders } = await supabase.from('orders').select('*');
    
    if (orders) {
      const totalRevenue = orders.reduce((sum, o: Order) => sum + o.total, 0);
      const ordersByStatus = orders.reduce((acc, o: Order) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        ordersByStatus: {
          paid: ordersByStatus.paid || 0,
          preparing: ordersByStatus.preparing || 0,
          delivering: ordersByStatus.delivering || 0,
          delivered: ordersByStatus.delivered || 0,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <DashboardStats stats={stats} />
    </div>
  );
}
