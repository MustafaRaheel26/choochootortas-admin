import React, { useEffect, useState } from "react";
import { useStore } from "../store";
import {
  Filter,
  Search,
  Download,
  ChevronRight,
  Eye,
  Clock,
  Calendar as CalendarIcon,
  UtensilsCrossed,
  X,
  Printer,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "../utils/cn";
import { OrderStatus, OrderType } from "../types";

const statusColors = {
  [OrderStatus.NEW]: "bg-red-50 text-red-700 border-red-100",
  [OrderStatus.PREPARING]: "bg-amber-50 text-amber-700 border-amber-100",
  [OrderStatus.READY]: "bg-blue-50 text-blue-700 border-blue-100",
  [OrderStatus.COMPLETED]: "bg-green-50 text-green-700 border-green-100",
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://choochootortas-backend.onrender.com/api";

// Helper functions for print status
const getPrintStatusIcon = (status: string) => {
  const safeStatus = status || "pending";
  switch (safeStatus) {
    case "completed":
      return <CheckCircle size={14} className="text-green-600" />;
    case "failed":
      return <AlertCircle size={14} className="text-red-600" />;
    case "printing":
      return <RefreshCw size={14} className="text-blue-600 animate-spin" />;
    default:
      return <Clock size={14} className="text-yellow-600" />;
  }
};

const getPrintStatusText = (status: string) => {
  const safeStatus = status || "pending";
  switch (safeStatus) {
    case "completed":
      return "Printed";
    case "failed":
      return "Failed";
    case "printing":
      return "Printing";
    default:
      return "Pending";
  }
};

// Order Details Modal Component
function OrderDetailsModal({
  order,
  onClose,
  onRetryPrint,
}: {
  order: any;
  onClose: () => void;
  onRetryPrint: (orderId: string, jobType: string) => void;
}) {
  const orderNumber = order?.id?.split("_")[1] || order?.id || "???";
  const orderDate = order?.createdAt ? new Date(order.createdAt) : new Date();
  const [printStatus, setPrintStatus] = useState(order?.printStatus || null);
  const [loading, setLoading] = useState(false);

  // Fetch print status
  const fetchPrintStatus = async () => {
    if (!order?.id) return;
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(
        `${API_BASE_URL}/orders/${order.id}/print-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setPrintStatus(data.printStatus);
      }
    } catch (error) {
      console.error("Failed to fetch print status:", error);
    }
  };

  useEffect(() => {
    fetchPrintStatus();
    const interval = setInterval(fetchPrintStatus, 5000);
    return () => clearInterval(interval);
  }, [order?.id]);

  // Safe status values
  const kitchenStatus = printStatus?.kitchen || "pending";
  const barStatus = printStatus?.bar || "pending";
  const customerStatus = printStatus?.customer || "pending";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-zinc-100 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-zinc-900">Order Details</h2>
            <p className="text-zinc-500 text-sm">Order #{orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Print Status Section */}
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200">
            <h3 className="text-sm font-bold text-zinc-700 mb-3 flex items-center gap-2">
              <Printer size={16} />
              Print Status
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {/* Kitchen */}
              <div className="bg-white rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {getPrintStatusIcon(kitchenStatus)}
                  <span className="text-xs font-bold text-zinc-600">
                    Kitchen
                  </span>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    kitchenStatus === "completed"
                      ? "text-green-600"
                      : kitchenStatus === "failed"
                        ? "text-red-600"
                        : "text-yellow-600",
                  )}
                >
                  {getPrintStatusText(kitchenStatus)}
                </span>
                {kitchenStatus === "failed" && (
                  <button
                    onClick={() => onRetryPrint(order.id, "kitchen")}
                    className="mt-2 w-full flex items-center justify-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    <RefreshCw size={10} />
                    Retry
                  </button>
                )}
              </div>
              {/* Bar */}
              <div className="bg-white rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {getPrintStatusIcon(barStatus)}
                  <span className="text-xs font-bold text-zinc-600">Bar</span>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    barStatus === "completed"
                      ? "text-green-600"
                      : barStatus === "failed"
                        ? "text-red-600"
                        : "text-yellow-600",
                  )}
                >
                  {getPrintStatusText(barStatus)}
                </span>
                {barStatus === "failed" && (
                  <button
                    onClick={() => onRetryPrint(order.id, "bar")}
                    className="mt-2 w-full flex items-center justify-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    <RefreshCw size={10} />
                    Retry
                  </button>
                )}
              </div>
              {/* Customer */}
              <div className="bg-white rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {getPrintStatusIcon(customerStatus)}
                  <span className="text-xs font-bold text-zinc-600">
                    Receipt
                  </span>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    customerStatus === "completed"
                      ? "text-green-600"
                      : customerStatus === "failed"
                        ? "text-red-600"
                        : "text-yellow-600",
                  )}
                >
                  {getPrintStatusText(customerStatus)}
                </span>
                {customerStatus === "failed" && (
                  <button
                    onClick={() => onRetryPrint(order.id, "customer")}
                    className="mt-2 w-full flex items-center justify-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    <RefreshCw size={10} />
                    Retry
                  </button>
                )}
              </div>
            </div>
            {printStatus?.lastError && (
              <p className="text-xs text-red-500 mt-3 text-center">
                Error: {printStatus.lastError}
              </p>
            )}
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-50 rounded-2xl">
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Order Type
              </p>
              <p className="text-sm font-bold capitalize">
                {order?.orderType === "eat-in" ? "EAT IN" : "TAKE OUT"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Status
              </p>
              <span
                className={cn(
                  "inline-block px-2 py-1 rounded-lg text-xs font-bold uppercase",
                  order?.status === "new"
                    ? "bg-red-100 text-red-700"
                    : order?.status === "preparing"
                      ? "bg-amber-100 text-amber-700"
                      : order?.status === "ready"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700",
                )}
              >
                {order?.status || "unknown"}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Date
              </p>
              <p className="text-sm font-medium">
                {orderDate.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Time
              </p>
              <p className="text-sm font-medium">
                {orderDate.toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-lg font-bold text-zinc-900 mb-4">
              Order Items
            </h3>
            <div className="space-y-4">
              {(order?.items || []).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="border-b border-zinc-100 pb-4 last:border-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-zinc-900 text-base">
                        {item.name || item.itemName}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-zinc-900">
                      {formatCurrency((item.price || 0) * item.quantity)}
                    </p>
                  </div>

                  {/* Removed Ingredients */}
                  {item.removed && item.removed.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-bold text-red-600 mb-1">
                        ❌ Removed:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.removed.map((r: string, i: number) => (
                          <span
                            key={i}
                            className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full"
                          >
                            No {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extra Ingredients */}
                  {item.extras && item.extras.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-bold text-green-600 mb-1">
                        ✅ Extra:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.extras.map((e: string, i: number) => (
                          <span
                            key={i}
                            className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full"
                          >
                            + {e}
                          </span>
                        ))}
                      </div>
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
              <span className="font-medium">
                {formatCurrency(order?.subtotal || 0)}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-600">Tax</span>
              <span className="font-medium">
                {formatCurrency(order?.tax || 0)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-t border-zinc-100 mt-2 pt-3">
              <span className="text-lg font-bold text-zinc-900">Total</span>
              <span className="text-lg font-bold text-red-600">
                {formatCurrency(order?.totalPrice || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Orders() {
  const { orders, fetchOrders, loading } = useStore();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState<{
    orderId: string;
    jobType: string;
  } | null>(null);
  const [retryMessage, setRetryMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Handle retry print
  const handleRetryPrint = async (orderId: string, jobType: string) => {
    setRetrying({ orderId, jobType });
    setRetryMessage(null);

    try {
      const token = localStorage.getItem("admin_token");
      const jobsResponse = await fetch(
        `${API_BASE_URL}/print-jobs/order/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const jobsData = await jobsResponse.json();

      if (jobsData.success) {
        const failedJob = jobsData.jobs.find(
          (job: any) => job.type === jobType && job.status === "failed",
        );
        if (failedJob) {
          const retryResponse = await fetch(
            `${API_BASE_URL}/print-jobs/${failedJob.jobId}/retry`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          );
          const retryData = await retryResponse.json();

          if (retryData.success) {
            setRetryMessage({
              type: "success",
              text: `Retry initiated for ${jobType} printer`,
            });
            fetchOrders();
          } else {
            setRetryMessage({
              type: "error",
              text: retryData.error || "Failed to retry print",
            });
          }
        } else {
          setRetryMessage({
            type: "error",
            text: `No failed job found for ${jobType} printer`,
          });
        }
      }
    } catch (error) {
      console.error("Failed to retry print:", error);
      setRetryMessage({
        type: "error",
        text: "Failed to retry print. Please try again.",
      });
    } finally {
      setRetrying(null);
      setTimeout(() => setRetryMessage(null), 3000);
    }
  };

  const filteredOrders = React.useMemo(() => {
    try {
      let filtered = [...orders];

      if (activeTab !== "all") {
        filtered = filtered.filter((order) => order.status === activeTab);
      }

      if (selectedType !== "all") {
        filtered = filtered.filter((order) => order.orderType === selectedType);
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter((order) => {
          try {
            const orderNumber = order.id?.split("_")[1] || order.id;
            return orderNumber?.toLowerCase().includes(query);
          } catch (err) {
            return false;
          }
        });
      }

      return filtered;
    } catch (err) {
      console.error("Filter error:", err);
      return [];
    }
  }, [orders, activeTab, selectedType, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 3);
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

  return (
    <div className="space-y-6">
      {/* Retry Message Toast */}
      {retryMessage && (
        <div
          className={cn(
            "fixed top-20 right-6 z-[300] p-4 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-top-5",
            retryMessage.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white",
          )}
        >
          {retryMessage.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="text-sm font-medium">{retryMessage.text}</span>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRetryPrint={handleRetryPrint}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-zinc-900">Live Orders</h1>
            <div className="flex items-center gap-1.5 bg-red-100 px-2 py-0.5 rounded-full animate-pulse">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
              <span className="text-[10px] font-black text-red-600 uppercase">
                Live
              </span>
            </div>
          </div>
          <p className="text-zinc-500 mt-1">View and manage customer orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-zinc-200 p-1 rounded-xl shadow-sm">
            <button
              onClick={() => setSelectedType("all")}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer",
                selectedType === "all"
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-400",
              )}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType(OrderType.EAT_IN)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer text-nowrap",
                selectedType === OrderType.EAT_IN
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400",
              )}
            >
              Eat In
            </button>
            <button
              onClick={() => setSelectedType(OrderType.TAKE_OUT)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer text-nowrap",
                selectedType === OrderType.TAKE_OUT
                  ? "bg-orange-600 text-white"
                  : "text-zinc-400",
              )}
            >
              Take Out
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 w-full md:w-auto scrollbar-hide">
          {["all", ...Object.values(OrderStatus)].map((s) => (
            <button
              key={s}
              onClick={() => setActiveTab(s)}
              className={cn(
                "px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer",
                activeTab === s
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
                  : "bg-transparent text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50",
              )}
            >
              {s === "all" ? "ALL ORDERS" : s.toUpperCase()}
              {orders.filter((o) => o.status === s).length > 0 && (
                <span
                  className={cn(
                    "ml-2 text-[10px] px-1.5 py-0.5 rounded-full",
                    activeTab === s
                      ? "bg-red-500 text-white"
                      : "bg-zinc-100 text-zinc-500",
                  )}
                >
                  {orders.filter((o) => o.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            size={18}
          />
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
            <p className="font-bold uppercase tracking-widest text-xs">
              No orders found
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const orderNumber = order.id?.split("_")[1] || order.id || "???";
            const orderDate = order.createdAt
              ? new Date(order.createdAt)
              : new Date();
            const timeAgo = Math.floor(
              (Date.now() - orderDate.getTime()) / 60000,
            );
            const printStatus = order.printStatus || {};

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-zinc-500/5 transition-all duration-300"
              >
                <div className="p-6 flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                        Order ID
                      </span>
                      <span className="text-lg font-black text-zinc-900 tracking-tighter">
                        #{orderNumber}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border",
                        statusColors[order.status],
                      )}
                    >
                      {order.status}
                    </div>
                  </div>

                  {/* Print Status Mini Indicators */}
                  <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
                    <div className="flex items-center gap-1">
                      <Printer size={12} className="text-zinc-400" />
                      <span className="text-[10px] font-bold uppercase text-zinc-500">
                        K:
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold",
                          printStatus.kitchen === "completed"
                            ? "text-green-600"
                            : printStatus.kitchen === "failed"
                              ? "text-red-600"
                              : "text-yellow-500",
                        )}
                      >
                        {printStatus.kitchen === "completed"
                          ? "✅"
                          : printStatus.kitchen === "failed"
                            ? "❌"
                            : "⏳"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold uppercase text-zinc-500">
                        B:
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold",
                          printStatus.bar === "completed"
                            ? "text-green-600"
                            : printStatus.bar === "failed"
                              ? "text-red-600"
                              : "text-yellow-500",
                        )}
                      >
                        {printStatus.bar === "completed"
                          ? "✅"
                          : printStatus.bar === "failed"
                            ? "❌"
                            : "⏳"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold uppercase text-zinc-500">
                        R:
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold",
                          printStatus.customer === "completed"
                            ? "text-green-600"
                            : printStatus.customer === "failed"
                              ? "text-red-600"
                              : "text-yellow-500",
                        )}
                      >
                        {printStatus.customer === "completed"
                          ? "✅"
                          : printStatus.customer === "failed"
                            ? "❌"
                            : "⏳"}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-3">
                    {(order.items || []).slice(0, 2).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-bold text-zinc-800">
                            {item.name || item.itemName}
                          </span>
                          <span className="text-red-600 font-black text-sm ml-2">
                            x{item.quantity}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-zinc-500">
                          {formatCurrency((item.price || 0) * item.quantity)}
                        </span>
                      </div>
                    ))}
                    {(order.items || []).length > 2 && (
                      <p className="text-xs text-zinc-400">
                        +{(order.items || []).length - 2} more items
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500">
                      <Clock size={14} />
                      <span>{timeAgo} min ago</span>
                    </div>
                    <div className="flex items-center gap-1.5 uppercase text-xs font-bold">
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          order.orderType === "eat-in"
                            ? "bg-blue-500"
                            : "bg-orange-500",
                        )}
                      />
                      {order.orderType === "eat-in" ? "EAT IN" : "TAKE OUT"}
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
