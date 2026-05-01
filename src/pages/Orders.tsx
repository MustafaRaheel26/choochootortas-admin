import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Filter, Search, Download, ChevronRight, MoreHorizontal, Eye, Clock, Calendar as CalendarIcon, UtensilsCrossed } from 'lucide-react';
import { cn } from '../utils/cn';
import { OrderStatus, OrderType } from '../types';

const statusColors = {
  [OrderStatus.NEW]: "bg-red-50 text-red-700 border-red-100",
  [OrderStatus.PREPARING]: "bg-amber-50 text-amber-700 border-amber-100",
  [OrderStatus.READY]: "bg-blue-50 text-blue-700 border-blue-100",
  [OrderStatus.COMPLETED]: "bg-green-50 text-green-700 border-green-100",
};

export function Orders() {
  const { orders, fetchOrders, loading, updateOrderStatus } = useStore();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesType = selectedType === 'all' || order.orderType === selectedType;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.items.some(i => i.itemName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-zinc-900">Live Orders</h1>
            <div className="flex items-center gap-1.5 bg-red-100 px-2 py-0.5 rounded-full animate-pulse">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
              <span className="text-[10px] font-black text-red-600 uppercase">Live</span>
            </div>
          </div>
          <p className="text-zinc-500 mt-1">Manage current kitchen flow and customer tickets.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-zinc-200 p-1 rounded-xl shadow-sm">
             <button 
               onClick={() => setSelectedType('all')}
               className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer", selectedType === 'all' ? "bg-zinc-900 text-white" : "text-zinc-400")}
             >All</button>
             <button 
               onClick={() => setSelectedType(OrderType.EAT_IN)}
               className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer text-nowrap", selectedType === OrderType.EAT_IN ? "bg-blue-600 text-white" : "text-zinc-400")}
             >Eat In</button>
             <button 
               onClick={() => setSelectedType(OrderType.TAKE_OUT)}
               className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer text-nowrap", selectedType === OrderType.TAKE_OUT ? "bg-orange-600 text-white" : "text-zinc-400")}
             >Take Out</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 w-full md:w-auto scrollbar-hide">
          {['all', ...Object.values(OrderStatus)].map((s) => (
            <button
              key={s}
              onClick={() => setActiveTab(s)}
              className={cn(
                "px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer",
                activeTab === s 
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/20" 
                  : "bg-transparent text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
              )}
            >
              {s}
              {orders.filter(o => o.status === s).length > 0 && (
                <span className={cn(
                  "ml-2 text-[10px] px-1.5 py-0.5 rounded-full",
                  activeTab === s ? "bg-red-500 text-white" : "bg-zinc-100 text-zinc-500"
                )}>
                  {orders.filter(o => o.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Ticket ID..." 
            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-red-500 transition-all"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full h-80 flex flex-col items-center justify-center bg-white rounded-3xl border border-zinc-100 text-zinc-400 space-y-3">
             <UtensilsCrossed size={48} className="opacity-10" />
             <p className="font-bold uppercase tracking-widest text-xs">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-zinc-500/5 transition-all duration-300">
              <div className="p-6 flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Order ID</span>
                    <span className="text-lg font-black text-zinc-900 tracking-tighter">{order.id}</span>
                  </div>
                  <div className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border",
                    statusColors[order.status]
                  )}>
                    {order.status}
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <span className="text-red-600 font-black text-sm">{item.quantity}x</span>
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-zinc-800">{item.itemName}</span>
                           {(item.removeIngredients.length > 0 || item.extraIngredients.length > 0) && (
                             <div className="flex flex-col gap-0.5 mt-1">
                               {item.removeIngredients.map(i => <span key={i} className="text-[10px] text-red-500 font-bold uppercase truncate">No {i}</span>)}
                               {item.extraIngredients.map(i => <span key={i} className="text-[10px] text-green-600 font-bold uppercase truncate">Add {i}</span>)}
                             </div>
                           )}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-zinc-400 tracking-tighter">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>8m ago</span>
                  </div>
                  <div className="flex items-center gap-1.5 uppercase">
                    <div className={cn("w-1.5 h-1.5 rounded-full", order.orderType === 'eat-in' ? "bg-blue-500" : "bg-orange-500")} />
                    {order.orderType}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-zinc-50 border-t border-zinc-100 grid grid-cols-2 gap-2">
                <select 
                  className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-red-500 appearance-none cursor-pointer text-center"
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                >
                  {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
                <button className="bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors cursor-pointer">
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
