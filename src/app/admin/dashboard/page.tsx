'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Order } from '@/lib/types';
import { TrendingUp, DollarSign, ShoppingBag, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  month: string;
  revenue: number;
}

interface DailyData {
  day: string;
  revenue: number;
}

interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}

interface DashboardData {
  todaySales: { revenue: number; orders: number };
  monthSales: { revenue: number; orders: number };
  trendData: MonthlyData[] | DailyData[];
  topItems: TopItem[];
}

export default function AdminDashboardPage() {
  const [todaySales, setTodaySales] = useState({ revenue: 0, orders: 0 });
  const [monthSales, setMonthSales] = useState({ revenue: 0, orders: 0 });
  const [trendData, setTrendData] = useState<MonthlyData[] | DailyData[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [useMockData, setUseMockData] = useState(false);
  const [trendView, setTrendView] = useState<'monthly' | 'daily'>('monthly');
  const [aiInsight, setAiInsight] = useState('');
  const [aiInsightLoading, setAiInsightLoading] = useState(false);

  const fetchAIInsight = useCallback(async (data: DashboardData) => {
    setAiInsightLoading(true);
    try {
      const res = await fetch('/api/generate-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      const { insight } = await res.json();
      setAiInsight(insight);
    } catch (error) {
      console.error('Failed to fetch AI insight', error);
      setAiInsight('Could not generate insight at this time.');
    } finally {
      setAiInsightLoading(false);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    if (useMockData) {
      const todaySales = { revenue: 1250.50, orders: 15 };
      const monthSales = { revenue: 18750.75, orders: 225 };
      const trendData = [
        { month: 'Aug', revenue: 12500 },
        { month: 'Sep', revenue: 15200 },
        { month: 'Oct', revenue: 18900 },
        { month: 'Nov', revenue: 16400 },
        { month: 'Dec', revenue: 21300 },
        { month: 'Jan', revenue: 18750 },
      ];
      const topItems = [
        { name: 'Nasi Lemak Special', quantity: 45, revenue: 675 },
        { name: 'Mee Goreng', quantity: 38, revenue: 456 },
        { name: 'Roti Canai Set', quantity: 52, revenue: 416 },
        { name: 'Teh Tarik', quantity: 89, revenue: 267 },
        { name: 'Nasi Ayam', quantity: 31, revenue: 372 },
      ];
      setTodaySales(todaySales);
      setMonthSales(monthSales);
      setTrendData(trendData);
      setTopItems(topItems);
      fetchAIInsight({ todaySales, monthSales, trendData, topItems });
      return;
    }

    const { data: orders } = await supabase.from('orders').select('*');
    
    if (!orders) return;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Today's sales
    const todayOrders = orders.filter(o => new Date(o.created_at) >= todayStart);
    const todaySalesData = {
      revenue: todayOrders.reduce((sum, o) => sum + o.total, 0),
      orders: todayOrders.length,
    };
    setTodaySales(todaySalesData);

    // This month's sales
    const monthOrders = orders.filter(o => new Date(o.created_at) >= monthStart);
    const monthSalesData = {
      revenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
      orders: monthOrders.length,
    };
    setMonthSales(monthSalesData);

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

    if (trendView === 'monthly') {
      // Monthly trend (last 6 months)
      const months: MonthlyData[] = [];
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
      setTrendData(months);
      fetchAIInsight({ todaySales: todaySalesData, monthSales: monthSalesData, trendData: months, topItems: topItemsArray });
    } else {
      // Daily trend (last 7 days)
      const days: DailyData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
        const dayOrders = orders.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate >= date && orderDate < nextDay;
        });
        days.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
        });
      }
      setTrendData(days);
      fetchAIInsight({ todaySales: todaySalesData, monthSales: monthSalesData, trendData: days, topItems: topItemsArray });
    }
  }, [useMockData, trendView, fetchAIInsight]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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
            <span>Today&apos;s Sales</span>
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

      {/* AI Insight */}
      <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5" />
          <h2 className="font-semibold">AI Insight</h2>
        </div>
        {aiInsightLoading ? (
          <p className="text-sm text-muted-foreground">Generating insight...</p>
        ) : (
          <p className="text-sm">{aiInsight}</p>
        )}
      </div>

      {/* Monthly Trend */}
      <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <h2 className="font-semibold">{trendView === 'monthly' ? 'Monthly' : 'Daily'} Revenue Trend</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTrendView('daily')} disabled={trendView === 'daily'} className="px-3 py-1 text-sm rounded border border-input disabled:opacity-50">Daily</button>
            <button onClick={() => setTrendView('monthly')} disabled={trendView === 'monthly'} className="px-3 py-1 text-sm rounded border border-input disabled:opacity-50">Monthly</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={trendView === 'monthly' ? 'month' : 'day'} stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
