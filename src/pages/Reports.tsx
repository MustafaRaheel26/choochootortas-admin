import React, { useEffect } from 'react';
import { useStore } from '../store';
import { Calendar, Download, ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#dc2626', '#000000', '#4b5563', '#9ca3af'];

export function Reports() {
  const { salesReport, fetchReport } = useStore();

  useEffect(() => {
    fetchReport();
  }, []);

  if (!salesReport) return <div className="h-96 flex items-center justify-center">Crunching numbers...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Financial Reports</h1>
          <p className="text-zinc-500 mt-1">Detailed breakdown of sales, taxes, and performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-zinc-200 px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm font-bold text-zinc-700 cursor-pointer">
            <Calendar size={18} className="text-zinc-400" />
            <span>May 01 - May 20, 2024</span>
            <ChevronDown size={16} className="text-zinc-400" />
          </div>
          <button className="flex items-center gap-2 bg-zinc-900 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-black shadow-lg shadow-zinc-900/10 cursor-pointer transition-all">
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <span className="text-zinc-500 text-sm font-medium">Gross Revenue</span>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-4xl font-bold text-zinc-900">${salesReport.totalSales.toFixed(2)}</span>
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-lg text-xs font-bold mb-1.5">
              <ArrowUpRight size={14} />
              14%
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-600" />
                Dine In
              </span>
              <span className="text-zinc-900">$840.20</span>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-900" />
                Take Out
              </span>
              <span className="text-zinc-900">$400.30</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <span className="text-zinc-500 text-sm font-medium">Estimated Tax (8%)</span>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-4xl font-bold text-zinc-900">${salesReport.taxCollected.toFixed(2)}</span>
            <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-lg text-xs font-bold mb-1.5">
              <ArrowDownRight size={14} />
              2%
            </div>
          </div>
          <p className="text-zinc-400 text-xs mt-6 leading-relaxed">Tax calculated based on current state rates. Subject to change via settings.</p>
        </div>

        <div className="bg-zinc-900 p-8 rounded-3xl text-white shadow-xl shadow-zinc-900/10">
          <span className="text-zinc-400 text-sm font-medium">Avg Order Value</span>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-4xl font-bold">${(salesReport.totalSales / salesReport.totalOrders).toFixed(2)}</span>
          </div>
          <div className="mt-8 bg-zinc-800 rounded-2xl p-4">
             <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold">Capacity Utilization</span>
               <span className="text-xs font-bold text-red-500">84%</span>
             </div>
             <div className="w-full bg-zinc-700 h-1.5 rounded-full overflow-hidden">
               <div className="bg-red-600 h-full w-[84%]" />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-xl font-bold text-zinc-900 mb-8">Items Sold by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesReport.itemsSoldByCategory} barGap={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="categoryName" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4b5563', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#dc2626" radius={[6, 6, 0, 0]} barSize={40} name="Units Sold" />
                <Bar dataKey="revenue" fill="#000000" radius={[6, 6, 0, 0]} barSize={40} name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-zinc-900 mb-8">Sales Distribution</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesReport.itemsSoldByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="revenue"
                >
                  {salesReport.itemsSoldByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {salesReport.itemsSoldByCategory.map((item, index) => (
              <div key={item.categoryId} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs font-bold text-zinc-600 uppercase tracking-wide truncate">{item.categoryName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
