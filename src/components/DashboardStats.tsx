'use client';

import { CreditCard, ChefHat, Truck, CheckCircle } from 'lucide-react';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  ordersByStatus: {
    paid: number;
    preparing: number;
    delivering: number;
    delivered: number;
  };
}

export default function DashboardStats({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-4">
      <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
        <h3 className="text-muted-foreground text-sm mb-1">Total Revenue</h3>
        <p className="text-3xl font-bold text-primary">
          RM {stats.totalRevenue.toFixed(2)}
        </p>
      </div>

      <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
        <h3 className="text-muted-foreground text-sm mb-1">Total Orders</h3>
        <p className="text-3xl font-bold">{stats.totalOrders}</p>
      </div>

      <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6">
        <h3 className="font-semibold mb-3">Orders by Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> Paid</span>
            <span className="font-semibold">{stats.ordersByStatus.paid}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><ChefHat className="w-4 h-4" /> Preparing</span>
            <span className="font-semibold">{stats.ordersByStatus.preparing}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Delivering</span>
            <span className="font-semibold">{stats.ordersByStatus.delivering}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Delivered</span>
            <span className="font-semibold">{stats.ordersByStatus.delivered}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
