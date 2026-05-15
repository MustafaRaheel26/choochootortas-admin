import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Store, Receipt, Printer, CreditCard, Info, RefreshCw, AlertCircle, CheckCircle, Wifi, WifiOff, Printer as PrinterIcon, Play } from 'lucide-react';
import { cn } from '../utils/cn';

const API_BASE_URL = "https://choochootortas-backend.onrender.com/api";

interface PrinterStatus {
  status: string;
  ip?: string;
  name?: string;
  enabled: boolean;
  error?: string | null;
}

interface PrinterStatusData {
  printingEnabled: boolean;
  bridgeConnected: boolean;
  bridgeUrl: string;
  printers: {
    kitchen: PrinterStatus;
    bar: PrinterStatus;
    customer: PrinterStatus;
  };
  lastPoll: string;
  error?: string;
}

export function Settings() {
  const { settings, fetchSettings } = useStore();
  const [activeSection, setActiveSection] = useState('printer');
  const [printerStatus, setPrinterStatus] = useState<PrinterStatusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [testMessage, setTestMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPrinterStatus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/settings/printer-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setPrinterStatus(data.data);
      } else {
        console.error('Printer status API error:', data);
      }
    } catch (error) {
      console.error('Failed to fetch printer status:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendTestPrint = async (printer: string) => {
    setTesting(printer);
    setTestMessage(null);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/settings/printer-test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ printer })
      });
      const data = await response.json();
      if (data.success) {
        setTestMessage({ type: 'success', text: `Test print sent to ${printer} printer!` });
        // Refresh status after test
        setTimeout(fetchPrinterStatus, 2000);
      } else {
        setTestMessage({ type: 'error', text: data.error || `Failed to send test print to ${printer}` });
      }
    } catch (error) {
      setTestMessage({ type: 'error', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setTesting(null);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchPrinterStatus();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchPrinterStatus, 10000);
    return () => clearInterval(interval);
  }, [fetchSettings]);

  const getPrinterStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return { icon: CheckCircle, color: 'text-green-600 bg-green-50', text: 'Ready' };
      case 'online':
        return { icon: Wifi, color: 'text-green-600 bg-green-50', text: 'Online' };
      case 'offline':
        return { icon: WifiOff, color: 'text-red-600 bg-red-50', text: 'Offline' };
      case 'error':
        return { icon: AlertCircle, color: 'text-red-600 bg-red-50', text: 'Error' };
      default:
        return { icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50', text: 'Unknown' };
    }
  };

  const sections = [
    { id: 'restaurant', icon: Store, label: 'Restaurant Info' },
    { id: 'tax', icon: Receipt, label: 'Tax Settings' },
    { id: 'printer', icon: Printer, label: 'Printer Setup' },
    { id: 'payment', icon: CreditCard, label: 'Payment Gateway' },
  ];

  if (!settings) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">System Settings</h1>
        <p className="text-zinc-500 mt-1">View and manage your business configuration.</p>
      </div>

      <div className="flex gap-8">
        <aside className="w-64 space-y-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer",
                activeSection === s.id 
                  ? "bg-zinc-900 text-white shadow-lg" 
                  : "text-zinc-500 hover:bg-zinc-100"
              )}
            >
              <s.icon size={18} />
              {s.label}
            </button>
          ))}
        </aside>

        <div className="flex-1 bg-white rounded-3xl border border-zinc-200 shadow-sm p-8 space-y-8">
          {activeSection === 'restaurant' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-xl">
                <Info size={18} />
                <span className="text-sm font-medium">Restaurant information is configured by the system administrator.</span>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Restaurant Name</label>
                  <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 font-medium">
                    {settings.name}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Business Address</label>
                  <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 font-medium">
                    {settings.address}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Phone Number</label>
                    <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 font-medium">
                      {settings.phone}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Support Email</label>
                    <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 font-medium">
                      {settings.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'tax' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-xl">
                <Info size={18} />
                <span className="text-sm font-medium">Tax rates are fixed and cannot be changed from this interface.</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sales Tax Rate (%)</label>
                <div className="w-32 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 font-bold">
                  {settings.taxRate}%
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Currency Symbol</label>
                <div className="w-32 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 font-bold">
                  {settings.currencySymbol} ({settings.currency})
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs text-amber-700 font-medium">
                  ℹ️ Tax rate is applied to all orders automatically. To change tax rates, please contact your system administrator.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'printer' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-zinc-900">Printer Status & Testing</h3>
                <button
                  onClick={fetchPrinterStatus}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>

              {testMessage && (
                <div className={cn(
                  "p-3 rounded-xl flex items-center gap-2",
                  testMessage.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                )}>
                  {testMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  <span className="text-sm">{testMessage.text}</span>
                </div>
              )}

              {/* Bridge Connection Status */}
              <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-zinc-600">Bridge Service</span>
                  {printerStatus?.printingEnabled ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Enabled</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">Disabled</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {printerStatus?.bridgeConnected ? (
                    <>
                      <Wifi size={16} className="text-green-600" />
                      <span className="text-sm text-zinc-600">Connected to {printerStatus.bridgeUrl}</span>
                    </>
                  ) : (
                    <>
                      <WifiOff size={16} className="text-red-600" />
                      <span className="text-sm text-red-600">Bridge not connected - check if bridge service is running</span>
                    </>
                  )}
                </div>
                {printerStatus?.error && (
                  <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                    Error: {printerStatus.error}
                  </div>
                )}
              </div>

              {/* Kitchen Printer */}
              <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <PrinterIcon size={24} className="text-zinc-700" />
                    <div>
                      <h4 className="font-bold text-zinc-900">Kitchen Printer</h4>
                      <p className="text-xs text-zinc-400">IP: {printerStatus?.printers?.kitchen?.ip || '192.168.1.127'}</p>
                    </div>
                  </div>
                  {printerStatus?.printers?.kitchen && (() => {
                    const badge = getPrinterStatusBadge(printerStatus.printers.kitchen.status);
                    const BadgeIcon = badge.icon;
                    return (
                      <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium", badge.color)}>
                        <BadgeIcon size={12} />
                        {badge.text}
                      </div>
                    );
                  })()}
                </div>
                {printerStatus?.printers?.kitchen?.error && (
                  <div className="mb-3 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                    Error: {printerStatus.printers.kitchen.error}
                  </div>
                )}
                <button
                  onClick={() => sendTestPrint('kitchen')}
                  disabled={testing !== null || !printerStatus?.bridgeConnected}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testing === 'kitchen' ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Play size={16} />
                  )}
                  Send Test Print
                </button>
              </div>

              {/* Bar Printer */}
              <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <PrinterIcon size={24} className="text-zinc-700" />
                    <div>
                      <h4 className="font-bold text-zinc-900">Bar Printer</h4>
                      <p className="text-xs text-zinc-400">IP: {printerStatus?.printers?.bar?.ip || '192.168.1.136'}</p>
                    </div>
                  </div>
                  {printerStatus?.printers?.bar && (() => {
                    const badge = getPrinterStatusBadge(printerStatus.printers.bar.status);
                    const BadgeIcon = badge.icon;
                    return (
                      <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium", badge.color)}>
                        <BadgeIcon size={12} />
                        {badge.text}
                      </div>
                    );
                  })()}
                </div>
                {printerStatus?.printers?.bar?.error && (
                  <div className="mb-3 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                    Error: {printerStatus.printers.bar.error}
                  </div>
                )}
                <button
                  onClick={() => sendTestPrint('bar')}
                  disabled={testing !== null || !printerStatus?.bridgeConnected}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testing === 'bar' ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Play size={16} />
                  )}
                  Send Test Print
                </button>
              </div>

              {/* Customer Receipt Printer */}
              <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <PrinterIcon size={24} className="text-zinc-700" />
                    <div>
                      <h4 className="font-bold text-zinc-900">Customer Receipt Printer</h4>
                      <p className="text-xs text-zinc-400">USB: {printerStatus?.printers?.customer?.name || 'Epson TM-U220B'}</p>
                    </div>
                  </div>
                  {printerStatus?.printers?.customer && (() => {
                    const badge = getPrinterStatusBadge(printerStatus.printers.customer.status);
                    const BadgeIcon = badge.icon;
                    return (
                      <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium", badge.color)}>
                        <BadgeIcon size={12} />
                        {badge.text}
                      </div>
                    );
                  })()}
                </div>
                {printerStatus?.printers?.customer?.error && (
                  <div className="mb-3 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                    Error: {printerStatus.printers.customer.error}
                  </div>
                )}
                <button
                  onClick={() => sendTestPrint('customer')}
                  disabled={testing !== null || !printerStatus?.bridgeConnected}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {testing === 'customer' ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Play size={16} />
                  )}
                  Send Test Print
                </button>
              </div>

              {printerStatus?.lastPoll && (
                <p className="text-xs text-zinc-400 text-center">
                  Last updated: {new Date(printerStatus.lastPoll).toLocaleTimeString()}
                </p>
              )}
            </div>
          )}

          {activeSection === 'payment' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-zinc-900 text-center py-12 text-zinc-300 italic">Payment gateway integration coming in v2.0</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}