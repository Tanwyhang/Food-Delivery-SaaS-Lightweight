'use client';

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
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-600 text-sm mb-1">Total Revenue</h3>
        <p className="text-3xl font-bold text-blue-600">
          RM {stats.totalRevenue.toFixed(2)}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-600 text-sm mb-1">Total Orders</h3>
        <p className="text-3xl font-bold">{stats.totalOrders}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-3">Orders by Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>💳 Paid</span>
            <span className="font-semibold">{stats.ordersByStatus.paid}</span>
          </div>
          <div className="flex justify-between">
            <span>👨🍳 Preparing</span>
            <span className="font-semibold">{stats.ordersByStatus.preparing}</span>
          </div>
          <div className="flex justify-between">
            <span>🚗 Delivering</span>
            <span className="font-semibold">{stats.ordersByStatus.delivering}</span>
          </div>
          <div className="flex justify-between">
            <span>✅ Delivered</span>
            <span className="font-semibold">{stats.ordersByStatus.delivered}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
