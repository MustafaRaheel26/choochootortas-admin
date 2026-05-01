import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hidden md:block">
          System Status: <span className="text-green-500">Operational</span>
        </div>
      </div>
    </header>
  );
}
