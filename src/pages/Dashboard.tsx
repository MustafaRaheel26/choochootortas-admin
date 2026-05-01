import React, { useEffect } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { useStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';

export function Dashboard() {
  const { salesReport, fetchReport, fetchOrders, orders, menu, fetchMenu } = useStore();

  useEffect(() => {
    fetchReport();
    fetchOrders();
    fetchMenu();
  }, []);

  if (!salesReport) return <div className="h-96 flex items-center justify-center font-medium text-zinc-400">Cooking your data...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-zinc-900">General Overview</h1>
        <p className="text-zinc-500 mt-1">Welcome back. Here's what's happening at Choo Choo Tortas today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Net Sales" 
          value={`$${salesReport.totalSales.toFixed(2)}`} 
          icon={DollarSign} 
          trend={12.5} 
          trendLabel="VS PREVIOUS DAY" 
        />
        <StatCard 
          title="Total Orders" 
          value={salesReport.totalOrders} 
          icon={ShoppingBag} 
          trend={8.2} 
          trendLabel="VS PREVIOUS DAY" 
        />
        <StatCard 
          title="Avg. Ticket" 
          value={`$${(salesReport.totalSales / salesReport.totalOrders).toFixed(2)}`} 
          icon={TrendingUp} 
          trend={-2.4} 
          trendLabel="VS PREVIOUS DAY" 
        />
        <StatCard 
          title="Customers" 
          value="42" 
          icon={Users} 
          trend={10} 
          trendLabel="NEW UNIQUE USERS" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-zinc-900">Revenue Performance</h3>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">LAST 7 DAYS</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesReport.recentSales}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-zinc-900">Orders by Category</h3>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">ALL TIME</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesReport.itemsSoldByCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="categoryName" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 500 }} width={80} />
                <Tooltip 
                  cursor={{ fill: '#fef2f2' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#dc2626" radius={[0, 4, 4, 0]} barSize={20} name="Tickets" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-zinc-900">Recent Orders</h3>
          <button className="text-red-600 text-sm font-semibold hover:underline cursor-pointer">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-zinc-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-zinc-600">
                    {order.items.map(i => `${i.quantity}x ${i.itemName}`).join(', ')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-md uppercase",
                      order.orderType === 'eat-in' ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
                    )}>
                      {order.orderType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "flex items-center gap-1.5 text-xs font-medium uppercase tracking-tight",
                      order.status === 'completed' ? "text-green-600" : "text-amber-600"
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", order.status === 'completed' ? "bg-green-600" : "bg-amber-600")} />
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">${order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-xs text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
