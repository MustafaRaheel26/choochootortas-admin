import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Store, Receipt, Printer, CreditCard, Info } from 'lucide-react';
import { cn } from '../utils/cn';

export function Settings() {
  const { settings, fetchSettings } = useStore();
  const [activeSection, setActiveSection] = useState('restaurant');

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">System Settings</h1>
        <p className="text-zinc-500 mt-1">View your business configuration.</p>
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
              <h3 className="text-xl font-bold text-zinc-900 text-center py-12 text-zinc-300 italic">Kitchen printer integration coming in v2.0</h3>
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