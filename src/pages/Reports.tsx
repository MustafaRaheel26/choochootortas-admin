import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Calendar, Download, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';

const COLORS = ['#dc2626', '#000000', '#4b5563', '#9ca3af', '#f59e0b', '#10b981'];

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

const rangeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
  { value: 'quarter', label: 'Last 3 Months' },
  { value: 'year', label: 'Last Year' },
];

export function Reports() {
  const { salesReport, fetchReport } = useStore();
  const [dateRange, setDateRange] = useState('week');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchReport(dateRange);
  }, [fetchReport, dateRange]);

  if (!salesReport) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  const avgOrderValue = salesReport.totalOrders > 0 
    ? salesReport.totalSales / salesReport.totalOrders 
    : 0;
    
  const displayTaxRate = salesReport.currentTaxRate || 8.25;
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
      
      // Header with Logo placeholder
      pdf.setFillColor(220, 38, 38);
      pdf.rect(0, 0, 210, 40, 'F');
      
      pdf.setFontSize(22);
      pdf.setTextColor(255, 255, 255);
      pdf.text('CHOO CHOO TORTAS', 105, 25, { align: 'center' });
      yOffset = 50;
      
      // Report Title
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
      
      // Divider
      pdf.setDrawColor(220, 38, 38);
      pdf.setLineWidth(0.5);
      pdf.line(20, yOffset, 190, yOffset);
      yOffset += 8;
      
      // Executive Summary
      pdf.setFontSize(12);
      pdf.setTextColor(31, 41, 55);
      pdf.setFillColor(243, 244, 246);
      pdf.rect(20, yOffset - 4, 170, 6, 'F');
      pdf.text('EXECUTIVE SUMMARY', 25, yOffset);
      yOffset += 10;
      
      // Key Metrics
      const cardWidth = 40;
      const cardHeight = 30;
      const startX = 20;
      
      pdf.setFillColor(239, 246, 255);
      pdf.rect(startX, yOffset, cardWidth, cardHeight, 'F');
      pdf.setFontSize(7);
      pdf.setTextColor(107, 114, 128);
      pdf.text('GROSS REVENUE', startX + cardWidth/2, yOffset + 8, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setTextColor(31, 41, 55);
      pdf.text(formatCurrency(salesReport.totalSales), startX + cardWidth/2, yOffset + 20, { align: 'center' });
      
      pdf.setFillColor(240, 253, 244);
      pdf.rect(startX + cardWidth + 5, yOffset, cardWidth, cardHeight, 'F');
      pdf.setFontSize(7);
      pdf.setTextColor(107, 114, 128);
      pdf.text('TAX COLLECTED', startX + cardWidth + 5 + cardWidth/2, yOffset + 8, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setTextColor(31, 41, 55);
      pdf.text(formatCurrency(salesReport.taxCollected), startX + cardWidth + 5 + cardWidth/2, yOffset + 20, { align: 'center' });
      
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
      pdf.text('TOTAL ORDERS', startX + (cardWidth + 5) * 3 + cardWidth/2, yOffset + 8, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setTextColor(31, 41, 55);
      pdf.text(salesReport.totalOrders.toString(), startX + (cardWidth + 5) * 3 + cardWidth/2, yOffset + 20, { align: 'center' });
      
      yOffset += cardHeight + 12;
      
      // Service Type
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
      
      // Daily Sales Table
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
      
      // Category Performance
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
        
        salesReport.itemsSoldByCategory.slice(0, 15).forEach((cat) => {
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
      
      // Footer
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
      
      const fileName = `choo-choo-tortas-financial-report-${currentRangeLabel.toLowerCase().replace(/\s/g, '-')}-${Date.now()}.pdf`;
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Financial Reports</h1>
          <p className="text-zinc-500 mt-1">Detailed breakdown of sales, taxes, and performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
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
            className="flex items-center gap-2 bg-zinc-900 px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-red-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            {isDownloading ? 'Generating...' : 'Download PDF Report'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <span className="text-zinc-500 text-sm font-medium">Gross Revenue</span>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-4xl font-bold text-zinc-900">{formatCurrency(salesReport.totalSales)}</span>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                EAT IN
              </span>
              <span className="text-zinc-900">{formatCurrency(salesReport.dineInTotal || 0)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-600" />
                TAKE OUT
              </span>
              <span className="text-zinc-900">{formatCurrency(salesReport.takeOutTotal || 0)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <span className="text-zinc-500 text-sm font-medium">Estimated Tax ({displayTaxRate}%)</span>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-4xl font-bold text-zinc-900">{formatCurrency(salesReport.taxCollected)}</span>
          </div>
          <p className="text-zinc-400 text-xs mt-6 leading-relaxed">Tax calculated based on current state rates. Changes apply to future orders.</p>
        </div>

        <div className="bg-zinc-900 p-8 rounded-3xl text-white shadow-xl shadow-zinc-900/10">
          <span className="text-zinc-400 text-sm font-medium">Avg Order Value</span>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-4xl font-bold">{formatCurrency(avgOrderValue)}</span>
          </div>
          <div className="mt-8 bg-zinc-800 rounded-2xl p-4">
             <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-bold">Total Orders</span>
               <span className="text-xs font-bold text-red-500">{salesReport.totalOrders}</span>
             </div>
             <div className="w-full bg-zinc-700 h-1.5 rounded-full overflow-hidden">
               <div className="bg-red-600 h-full" style={{ width: `${Math.min(100, (salesReport.totalOrders / 100) * 100)}%` }} />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
          <h3 className="text-xl font-bold text-zinc-900 mb-8">Items Sold by Category</h3>
          <div className="h-80">
            {salesReport.itemsSoldByCategory && salesReport.itemsSoldByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesReport.itemsSoldByCategory} barGap={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="categoryName" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#4b5563', fontWeight: 600 }} dy={10} angle={-15} textAnchor="end" height={80} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [value, 'Units Sold']}
                  />
                  <Bar dataKey="count" fill="#dc2626" radius={[6, 6, 0, 0]} barSize={40} name="Units Sold" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-400">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold text-zinc-900 mb-8">Sales Distribution</h3>
          <div className="flex-1 min-h-[300px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={8}
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
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-400">No data available</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {pieData.slice(0, 8).map((item: any, index: number) => (
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