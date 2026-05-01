import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Store, Receipt, Printer, CreditCard, Save } from 'lucide-react';
import { cn } from '../utils/cn';

export function Settings() {
  const { settings, fetchSettings } = useStore();
  const [activeSection, setActiveSection] = useState('restaurant');

  useEffect(() => {
    fetchSettings();
  }, []);

  if (!settings) return <div className="h-96 flex items-center justify-center">Loading settings...</div>;

  const sections = [
    { id: 'restaurant', icon: Store, label: 'Restaurant Info' },
    { id: 'tax', icon: Receipt, label: 'Tax Settings' },
    { id: 'printer', icon: Printer, label: 'Printer Setup' },
    { id: 'payment', icon: CreditCard, label: 'Payment Gateway' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">System Settings</h1>
        <p className="text-zinc-500 mt-1">Configure your business rules and hardware integrations.</p>
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
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h3 className="text-xl font-bold">General Information</h3>
               <div className="grid grid-cols-1 gap-6">
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Restaurant Name</label>
                   <input type="text" defaultValue={settings.name} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 font-medium" />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Business Address</label>
                   <input type="text" defaultValue={settings.address} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 font-medium" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Phone Number</label>
                     <input type="text" defaultValue={settings.phone} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 font-medium" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Support Email</label>
                     <input type="text" defaultValue={settings.email} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 font-medium" />
                   </div>
                 </div>
               </div>
            </div>
          )}

          {activeSection === 'tax' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h3 className="text-xl font-bold">Tax & Currency</h3>
               <div className="space-y-1.5">
                 <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sales Tax Rate (%)</label>
                 <div className="flex items-center gap-3">
                   <input type="number" defaultValue={settings.taxRate} className="w-32 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 font-bold" />
                   <span className="text-zinc-400 text-sm">Applied to all orders automatically.</span>
                 </div>
               </div>
               <div className="space-y-1.5">
                 <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Currency Symbol</label>
                 <select className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 font-bold appearance-none">
                    <option value="USD">USD ($)</option>
                    <option value="MXN">MXN ($)</option>
                    <option value="EUR">EUR (€)</option>
                 </select>
               </div>
            </div>
          )}

          {activeSection === 'printer' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h3 className="text-xl font-bold text-zinc-900 text-center py-12 text-zinc-300 italic">Kitchen printer integration coming in v2.0</h3>
            </div>
          )}

          <div className="pt-6 border-t border-zinc-100 flex justify-end">
            <button className="flex items-center gap-2 bg-red-600 px-8 py-3 rounded-2xl text-sm font-bold text-white hover:bg-red-700 shadow-lg shadow-red-900/10 transition-all cursor-pointer">
              <Save size={18} />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
