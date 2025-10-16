'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Order } from '@/lib/types';
import { TrendingUp, DollarSign, ShoppingBag, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  month: string;
  revenue: number;
}

interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}

export default function AdminDashboardPage() {
  const [todaySales, setTodaySales] = useState({ revenue: 0, orders: 0 });
  const [monthSales, setMonthSales] = useState({ revenue: 0, orders: 0 });
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyData[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [useMockData]);

  const fetchDashboardData = async () => {
    if (useMockData) {
      setTodaySales({ revenue: 1250.50, orders: 15 });
      setMonthSales({ revenue: 18750.75, orders: 225 });
      setMonthlyTrend([
        { month: 'Aug', revenue: 12500 },
        { month: 'Sep', revenue: 15200 },
        { month: 'Oct', revenue: 18900 },
        { month: 'Nov', revenue: 16400 },
        { month: 'Dec', revenue: 21300 },
        { month: 'Jan', revenue: 18750 },
      ]);
      setTopItems([
        { name: 'Nasi Lemak Special', quantity: 45, revenue: 675 },
        { name: 'Mee Goreng', quantity: 38, revenue: 456 },
        { name: 'Roti Canai Set', quantity: 52, revenue: 416 },
        { name: 'Teh Tarik', quantity: 89, revenue: 267 },
        { name: 'Nasi Ayam', quantity: 31, revenue: 372 },
      ]);
      return;
    }

    const { data: orders } = await supabase.from('orders').select('*');
    
    if (!orders) return;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Today's sales
    const todayOrders = orders.filter(o => new Date(o.created_at) >= todayStart);
    setTodaySales({
      revenue: todayOrders.reduce((sum, o) => sum + o.total, 0),
      orders: todayOrders.length,
    });

    // This month's sales
    const monthOrders = orders.filter(o => new Date(o.created_at) >= monthStart);
    setMonthSales({
      revenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
      orders: monthOrders.length,
    });

    // Monthly trend (last 6 months)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthOrders = orders.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= date && orderDate < nextMonth;
      });
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
      });
    }
    setMonthlyTrend(months);

    // Top selling items
    const itemMap = new Map<string, { quantity: number; revenue: number }>();
    orders.forEach((order: Order) => {
      order.items.forEach(item => {
        const existing = itemMap.get(item.name) || { quantity: 0, revenue: 0 };
        itemMap.set(item.name, {
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + (item.price * item.quantity),
        });
      });
    });
    const topItemsArray = Array.from(itemMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    setTopItems(topItemsArray);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setUseMockData(!useMockData)}
          className="px-3 py-1 text-sm rounded border border-input hover:bg-accent"
        >
          {useMockData ? 'Real Data' : 'Mock Data'}
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Today's Sales</span>
          </div>
          <p className="text-2xl font-bold text-primary">RM {todaySales.revenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">{todaySales.orders} orders</p>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>This Month</span>
          </div>
          <p className="text-2xl font-bold text-primary">RM {monthSales.revenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">{monthSales.orders} orders</p>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" />
          <h2 className="font-semibold">Monthly Revenue Trend</h2>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => `RM ${value.toFixed(2)}`}
            />
            <Line type="monotone" dataKey="revenue" stroke="oklch(0.645 0.246 16.439)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Selling Items */}
      <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5" />
          <h2 className="font-semibold">Top Selling Items</h2>
        </div>
        <div className="space-y-3">
          {topItems.map((item, idx) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-muted-foreground">#{idx + 1}</span>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.quantity} sold</p>
                </div>
              </div>
              <p className="font-bold text-primary">RM {item.revenue.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
