import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Filter, Search, Download, ChevronRight, MoreHorizontal, Eye, Clock, Calendar as CalendarIcon, UtensilsCrossed, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { OrderStatus, OrderType } from '../types';

const statusColors = {
  [OrderStatus.NEW]: "bg-red-50 text-red-700 border-red-100",
  [OrderStatus.PREPARING]: "bg-amber-50 text-amber-700 border-amber-100",
  [OrderStatus.READY]: "bg-blue-50 text-blue-700 border-blue-100",
  [OrderStatus.COMPLETED]: "bg-green-50 text-green-700 border-green-100",
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Order Details Modal Component with full details
function OrderDetailsModal({ order, onClose }: { order: any; onClose: () => void }) {
  const orderNumber = order.id.split('_')[1] || order.id;
  const orderDate = new Date(order.createdAt);
  
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-zinc-100 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-zinc-900">Order Details</h2>
            <p className="text-zinc-500 text-sm">Order #{orderNumber}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-50 rounded-2xl">
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Order Type</p>
              <p className="text-sm font-bold capitalize">{order.orderType === 'eat-in' ? 'EAT IN' : 'TAKE OUT'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</p>
              <span className={cn("inline-block px-2 py-1 rounded-lg text-xs font-bold uppercase", 
                order.status === 'new' ? "bg-red-100 text-red-700" :
                order.status === 'preparing' ? "bg-amber-100 text-amber-700" :
                order.status === 'ready' ? "bg-blue-100 text-blue-700" :
                "bg-green-100 text-green-700"
              )}>
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Date</p>
              <p className="text-sm font-medium">{orderDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Time</p>
              <p className="text-sm font-medium">{orderDate.toLocaleTimeString()}</p>
            </div>
          </div>
          
          {/* Items with full details */}
          <div>
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="border-b border-zinc-100 pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-zinc-900 text-base">{item.name || item.itemName}</p>
                      <p className="text-xs text-zinc-500 mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-zinc-900">{formatCurrency((item.price || 0) * item.quantity)}</p>
                  </div>
                  
                  {/* Removed Ingredients */}
                  {item.removed && item.removed.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-bold text-red-600 mb-1">❌ Removed Ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.removed.map((r: string, i: number) => (
                          <span key={i} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">No {r}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Extra Ingredients */}
                  {item.extras && item.extras.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-bold text-green-600 mb-1">✅ Extra Ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.extras.map((e: string, i: number) => (
                          <span key={i} className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">+ {e}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Notes if any */}
                  {item.notes && (
                    <div className="mt-2">
                      <p className="text-xs font-bold text-amber-600 mb-1">📝 Notes:</p>
                      <p className="text-xs text-zinc-600 italic bg-amber-50 p-2 rounded-lg">{item.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Totals */}
          <div className="pt-4 border-t border-zinc-200">
            <div className="flex justify-between py-2">
              <span className="text-zinc-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(order.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-600">Tax</span>
              <span className="font-medium">{formatCurrency(order.tax || 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-zinc-100 mt-2 pt-3">
              <span className="text-lg font-bold text-zinc-900">Total</span>
              <span className="text-lg font-bold text-red-600">{formatCurrency(order.totalPrice || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Orders() {
  const { orders, fetchOrders, loading } = useStore();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Safe filtering - prevents crash on search
  const filteredOrders = React.useMemo(() => {
    try {
      let filtered = [...orders];
      
      // Filter by status
      if (activeTab !== 'all') {
        filtered = filtered.filter(order => order.status === activeTab);
      }
      
      // Filter by type
      if (selectedType !== 'all') {
        filtered = filtered.filter(order => order.orderType === selectedType);
      }
      
      // Filter by search query - safe handling
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(order => {
          try {
            const orderNumber = order.id.split('_')[1] || order.id;
            const matchesId = orderNumber.toLowerCase().includes(query);
            const matchesItem = order.items.some(item => 
              (item.name || item.itemName) && (item.name || item.itemName).toLowerCase().includes(query)
            );
            return matchesId || matchesItem;
          } catch (err) {
            return false;
          }
        });
      }
      
      return filtered;
    } catch (err) {
      console.error('Filter error:', err);
      setError('Error filtering orders');
      return [];
    }
  }, [orders, activeTab, selectedType, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and limit to 3 digits to prevent crash
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 3);
    setSearchQuery(numericValue);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button onClick={() => { setError(null); fetchOrders(); }} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-zinc-900">Live Orders</h1>
            <div className="flex items-center gap-1.5 bg-red-100 px-2 py-0.5 rounded-full animate-pulse">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
              <span className="text-[10px] font-black text-red-600 uppercase">Live</span>
            </div>
          </div>
          <p className="text-zinc-500 mt-1">View and manage customer orders.</p>
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
              {s === 'all' ? 'ALL ORDERS' : s.toUpperCase()}
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
            placeholder="Search by Order #..." 
            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium outline-none focus:border-red-500 transition-all"
            value={searchQuery}
            onChange={handleSearch}
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
          filteredOrders.map((order) => {
            const orderNumber = order.id.split('_')[1] || order.id;
            const orderDate = new Date(order.createdAt);
            const timeAgo = Math.floor((Date.now() - orderDate.getTime()) / 60000);
            
            return (
              <div key={order.id} className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-zinc-500/5 transition-all duration-300">
                <div className="p-6 flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Order ID</span>
                      <span className="text-lg font-black text-zinc-900 tracking-tighter">#{orderNumber}</span>
                    </div>
                    <div className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border",
                      statusColors[order.status]
                    )}>
                      {order.status}
                    </div>
                  </div>

                  {/* Items with names and quantities */}
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div className="flex-1">
                          <span className="text-sm font-bold text-zinc-800">{item.name || item.itemName}</span>
                          <span className="text-red-600 font-black text-sm ml-2">x{item.quantity}</span>
                        </div>
                        <span className="text-sm font-bold text-zinc-500">{formatCurrency((item.price || 0) * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500">
                      <Clock size={14} />
                      <span>{timeAgo} min ago</span>
                    </div>
                    <div className="flex items-center gap-1.5 uppercase text-xs font-bold">
                      <div className={cn("w-1.5 h-1.5 rounded-full", order.orderType === 'eat-in' ? "bg-blue-500" : "bg-orange-500")} />
                      {order.orderType === 'eat-in' ? 'EAT IN' : 'TAKE OUT'}
                    </div>
                    <div className="text-sm font-black text-zinc-900">
                      {formatCurrency(order.totalPrice || 0)}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 border-t border-zinc-100">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="w-full py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}