import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Receipt, UtensilsCrossed, Package, Calendar, Download } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { useStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { cn } from '../utils/cn';
import jsPDF from 'jspdf';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const COLORS = ['#dc2626', '#000000', '#4b5563', '#9ca3af', '#f59e0b', '#10b981'];

const rangeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
  { value: 'quarter', label: 'Last 3 Months' },
  { value: 'year', label: 'Last Year' },
];

export function Dashboard() {
  const { salesReport, fetchReport, fetchOrders, orders, settings } = useStore();
  const [dateRange, setDateRange] = useState('week');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchReport(dateRange);
    fetchOrders();
  }, [fetchReport, fetchOrders, dateRange]);

  if (!salesReport) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const avgOrderValue = salesReport.totalOrders > 0 
    ? salesReport.totalSales / salesReport.totalOrders 
    : 0;

  const currentRangeLabel = rangeOptions.find(opt => opt.value === dateRange)?.label || 'Last 7 Days';

  const pieData = salesReport.itemsSoldByCategory && salesReport.itemsSoldByCategory.length > 0
    ? salesReport.itemsSoldByCategory.filter(c => c.revenue > 0)
    : [];

  const handleDownloadPDF = () => {
    try {
      setIsDownloading(true);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      let yOffset = 20;
      
      pdf.setFillColor(220, 38, 38);
      pdf.rect(0, 0, 210, 40, 'F');
      
      pdf.setFontSize(22);
      pdf.setTextColor(255, 255, 255);
      pdf.text('CHOO CHOO TORTAS', 105, 25, { align: 'center' });
      yOffset = 50;
      
      pdf.setFontSize(16);
      pdf.setTextColor(31, 41, 55);
      pdf.text('Financial Performance Report', 105, yOffset, { align: 'center' });
      yOffset += 8;
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Report Period: ${currentRangeLabel}`, 105, yOffset, { align: 'center' });
      yOffset += 6;
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 105, yOffset, { align: 'center' });
      yOffset += 15;
      
      pdf.setDrawColor(220, 38, 38);
      pdf.setLineWidth(0.5);
      pdf.line(20, yOffset, 190, yOffset);
      yOffset += 8;
      
      pdf.setFontSize(12);
      pdf.setTextColor(31, 41, 55);
      pdf.setFillColor(243, 244, 246);
      pdf.rect(20, yOffset - 4, 170, 6, 'F');
      pdf.text('EXECUTIVE SUMMARY', 25, yOffset);
      yOffset += 10;
      
      const cardWidth = 40;
      const cardHeight = 30;
      const startX = 20;
      
      pdf.setFillColor(239, 246, 255);
      pdf.rect(startX, yOffset, cardWidth, cardHeight, 'F');
      pdf.setFontSize(7);
      pdf.setTextColor(107, 114, 128);
      pdf.text('TOTAL REVENUE', startX + cardWidth/2, yOffset + 8, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setTextColor(31, 41, 55);
      pdf.text(formatCurrency(salesReport.totalSales), startX + cardWidth/2, yOffset + 20, { align: 'center' });
      
      pdf.setFillColor(240, 253, 244);
      pdf.rect(startX + cardWidth + 5, yOffset, cardWidth, cardHeight, 'F');
      pdf.setFontSize(7);
      pdf.setTextColor(107, 114, 128);
      pdf.text('TOTAL ORDERS', startX + cardWidth + 5 + cardWidth/2, yOffset + 8, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setTextColor(31, 41, 55);
      pdf.text(salesReport.totalOrders.toString(), startX + cardWidth + 5 + cardWidth/2, yOffset + 20, { align: 'center' });
      
      pdf.setFillColor(254, 242, 242);
      pdf.rect(startX + (cardWidth + 5) * 2, yOffset, cardWidth, cardHeight, 'F');
      pdf.setFontSize(7);
      pdf.setTextColor(107, 114, 128);
      pdf.text('AVG ORDER', startX + (cardWidth + 5) * 2 + cardWidth/2, yOffset + 8, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setTextColor(31, 41, 55);
      pdf.text(formatCurrency(avgOrderValue), startX + (cardWidth + 5) * 2 + cardWidth/2, yOffset + 20, { align: 'center' });
      
      pdf.setFillColor(255, 247, 237);
      pdf.rect(startX + (cardWidth + 5) * 3, yOffset, cardWidth, cardHeight, 'F');
      pdf.setFontSize(7);
      pdf.setTextColor(107, 114, 128);
      pdf.text('TAX', startX + (cardWidth + 5) * 3 + cardWidth/2, yOffset + 8, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setTextColor(31, 41, 55);
      pdf.text(formatCurrency(salesReport.taxCollected), startX + (cardWidth + 5) * 3 + cardWidth/2, yOffset + 20, { align: 'center' });
      
      yOffset += cardHeight + 12;
      
      pdf.setFontSize(12);
      pdf.setTextColor(31, 41, 55);
      pdf.setFillColor(243, 244, 246);
      pdf.rect(20, yOffset - 4, 170, 6, 'F');
      pdf.text('SERVICE TYPE BREAKDOWN', 25, yOffset);
      yOffset += 10;
      
      pdf.setFillColor(239, 246, 255);
      pdf.rect(20, yOffset, 82, 20, 'F');
      pdf.setTextColor(37, 99, 235);
      pdf.setFontSize(9);
      pdf.text('EAT IN', 61, yOffset + 8, { align: 'center' });
      pdf.setTextColor(31, 41, 55);
      pdf.setFontSize(12);
      pdf.text(formatCurrency(salesReport.dineInTotal || 0), 61, yOffset + 16, { align: 'center' });
      
      pdf.setFillColor(255, 247, 237);
      pdf.rect(108, yOffset, 82, 20, 'F');
      pdf.setTextColor(234, 88, 12);
      pdf.setFontSize(9);
      pdf.text('TAKE OUT', 149, yOffset + 8, { align: 'center' });
      pdf.setTextColor(31, 41, 55);
      pdf.setFontSize(12);
      pdf.text(formatCurrency(salesReport.takeOutTotal || 0), 149, yOffset + 16, { align: 'center' });
      
      yOffset += 30;
      
      pdf.setFontSize(12);
      pdf.setTextColor(31, 41, 55);
      pdf.setFillColor(243, 244, 246);
      pdf.rect(20, yOffset - 4, 170, 6, 'F');
      pdf.text('DAILY SALES BREAKDOWN', 25, yOffset);
      yOffset += 8;
      
      pdf.setFillColor(220, 38, 38);
      pdf.rect(20, yOffset, 40, 8, 'F');
      pdf.rect(60, yOffset, 40, 8, 'F');
      pdf.rect(100, yOffset, 40, 8, 'F');
      pdf.rect(140, yOffset, 50, 8, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.text('Date', 22, yOffset + 5);
      pdf.text('Day', 62, yOffset + 5);
      pdf.text('Orders', 102, yOffset + 5);
      pdf.text('Revenue', 142, yOffset + 5);
      yOffset += 8;
      
      pdf.setTextColor(31, 41, 55);
      pdf.setFontSize(8);
      
      salesReport.recentSales.forEach((day) => {
        const date = new Date(day.fullDate);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        
        pdf.text(formattedDate, 22, yOffset + 5);
        pdf.text(dayName, 62, yOffset + 5);
        pdf.text(day.orders.toString(), 102, yOffset + 5);
        pdf.text(formatCurrency(day.amount), 142, yOffset + 5);
        yOffset += 6;
        
        if (yOffset > 260) {
          pdf.addPage();
          yOffset = 20;
          pdf.setFillColor(220, 38, 38);
          pdf.rect(20, yOffset, 40, 8, 'F');
          pdf.rect(60, yOffset, 40, 8, 'F');
          pdf.rect(100, yOffset, 40, 8, 'F');
          pdf.rect(140, yOffset, 50, 8, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.text('Date', 22, yOffset + 5);
          pdf.text('Day', 62, yOffset + 5);
          pdf.text('Orders', 102, yOffset + 5);
          pdf.text('Revenue', 142, yOffset + 5);
          yOffset += 8;
          pdf.setTextColor(31, 41, 55);
        }
      });
      
      yOffset += 10;
      
      if (salesReport.itemsSoldByCategory && salesReport.itemsSoldByCategory.length > 0) {
        if (yOffset > 240) {
          pdf.addPage();
          yOffset = 20;
        }
        
        pdf.setFontSize(12);
        pdf.setTextColor(31, 41, 55);
        pdf.setFillColor(243, 244, 246);
        pdf.rect(20, yOffset - 4, 170, 6, 'F');
        pdf.text('CATEGORY PERFORMANCE', 25, yOffset);
        yOffset += 8;
        
        pdf.setFillColor(220, 38, 38);
        pdf.rect(20, yOffset, 80, 8, 'F');
        pdf.rect(100, yOffset, 40, 8, 'F');
        pdf.rect(140, yOffset, 50, 8, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.text('Category', 22, yOffset + 5);
        pdf.text('Units Sold', 102, yOffset + 5);
        pdf.text('Revenue', 142, yOffset + 5);
        yOffset += 8;
        
        pdf.setTextColor(31, 41, 55);
        pdf.setFontSize(8);
        
        salesReport.itemsSoldByCategory.slice(0, 12).forEach((cat) => {
          if (cat.count > 0 || cat.revenue > 0) {
            pdf.text(cat.categoryName, 22, yOffset + 5);
            pdf.text(cat.count.toString(), 102, yOffset + 5);
            pdf.text(formatCurrency(cat.revenue), 142, yOffset + 5);
            yOffset += 6;
            
            if (yOffset > 270) {
              pdf.addPage();
              yOffset = 20;
              pdf.setFillColor(220, 38, 38);
              pdf.rect(20, yOffset, 80, 8, 'F');
              pdf.rect(100, yOffset, 40, 8, 'F');
              pdf.rect(140, yOffset, 50, 8, 'F');
              pdf.setTextColor(255, 255, 255);
              pdf.text('Category', 22, yOffset + 5);
              pdf.text('Units Sold', 102, yOffset + 5);
              pdf.text('Revenue', 142, yOffset + 5);
              yOffset += 8;
              pdf.setTextColor(31, 41, 55);
            }
          }
        });
        
        yOffset += 10;
      }
      
      if (yOffset > 270) {
        pdf.addPage();
        yOffset = 20;
      }
      
      pdf.setDrawColor(229, 231, 235);
      pdf.line(20, yOffset, 190, yOffset);
      yOffset += 6;
      
      pdf.setFontSize(7);
      pdf.setTextColor(156, 163, 175);
      pdf.text('Choo Choo Tortas - Financial Performance Report', 105, yOffset, { align: 'center' });
      yOffset += 4;
      pdf.text('This is an official system-generated report. For questions, contact support@choochootortas.com', 105, yOffset, { align: 'center' });
      yOffset += 4;
      pdf.text(`Report ID: ${Date.now()} | Page 1 of 1`, 105, yOffset, { align: 'center' });
      
      const fileName = `choo-choo-tortas-report-${currentRangeLabel.toLowerCase().replace(/\s/g, '-')}-${Date.now()}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">General Overview</h1>
          <p className="text-zinc-500 mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-700 hover:border-red-300 transition-all"
            >
              <Calendar size={16} className="text-zinc-400" />
              {currentRangeLabel}
              <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {rangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setDateRange(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors",
                      dateRange === option.value ? "bg-red-50 text-red-600 font-medium" : "text-zinc-700"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-zinc-900 px-4 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-red-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            {isDownloading ? 'Generating...' : 'Download PDF Report'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Net Sales" 
          value={formatCurrency(salesReport.totalSales)} 
          icon={DollarSign} 
          trendLabel="TOTAL REVENUE" 
        />
        <StatCard 
          title="Total Orders" 
          value={salesReport.totalOrders} 
          icon={ShoppingBag} 
          trendLabel="COMPLETED ORDERS" 
        />
        <StatCard 
          title="Avg. Ticket" 
          value={formatCurrency(avgOrderValue)} 
          icon={TrendingUp} 
          trendLabel="AVERAGE ORDER VALUE" 
        />
        <StatCard 
          title="Tax Collected" 
          value={formatCurrency(salesReport.taxCollected)} 
          icon={Receipt} 
          trendLabel={`TAX (${salesReport.currentTaxRate || 8.25}%)`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <UtensilsCrossed className="text-blue-600" size={24} />
            <h3 className="text-lg font-bold text-zinc-900">EAT IN</h3>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-3xl font-black text-zinc-900">{formatCurrency(salesReport.dineInTotal || 0)}</span>
            <span className="text-sm text-zinc-500">{salesReport.dineInCount || 0} orders</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Package className="text-orange-600" size={24} />
            <h3 className="text-lg font-bold text-zinc-900">TAKE OUT</h3>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-3xl font-black text-zinc-900">{formatCurrency(salesReport.takeOutTotal || 0)}</span>
            <span className="text-sm text-zinc-500">{salesReport.takeOutCount || 0} orders</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-zinc-900">Revenue Performance</h3>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{currentRangeLabel}</span>
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
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-zinc-900">Orders by Category</h3>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{currentRangeLabel}</span>
          </div>
          <div className="h-72">
            {salesReport.itemsSoldByCategory && salesReport.itemsSoldByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesReport.itemsSoldByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="categoryName" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 500 }} width={120} />
                  <Tooltip 
                    formatter={(value: number) => [value, 'Items Sold']}
                    cursor={{ fill: '#fef2f2' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#dc2626" radius={[0, 4, 4, 0]} barSize={20} name="Items Sold" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-400">No category data available</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-zinc-900">Sales Distribution</h3>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">BY CATEGORY</span>
        </div>
        <div className="h-80">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="revenue"
                  label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                  labelLine={true}
                >
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-400">No sales data available</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-zinc-900">Recent Orders</h3>
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
              {orders.slice(0, 5).map((order) => {
                const orderNumber = order.id.split('_')[1] || order.id;
                return (
                  <tr key={order.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-zinc-900">#{orderNumber}</td>
                    <td className="px-6 py-4 text-sm text-zinc-600">
                      {order.items.map(i => `${i.quantity}x ${i.name || i.itemName || 'Item'}`).join(', ')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-md uppercase",
                        order.orderType === 'eat-in' ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
                      )}>
                        {order.orderType === 'eat-in' ? 'EAT IN' : 'TAKE OUT'}
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
                    <td className="px-6 py-4 text-sm font-bold">{formatCurrency(order.totalPrice || 0)}</td>
                    <td className="px-6 py-4 text-right text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}