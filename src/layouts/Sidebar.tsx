import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Utensils, BarChart3, Settings, TrainFront } from 'lucide-react';
import { cn } from '../utils/cn';
import { useStore } from '../store';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ShoppingBag, label: 'Orders', path: '/orders' },
  { icon: Utensils, label: 'Menu Management', path: '/menu' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const logout = useStore(state => state.logout);

  return (
    <aside className="w-64 bg-black text-white h-screen fixed left-0 top-0 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3 border-b border-zinc-800">
        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center overflow-hidden">
          {/* Placeholder for future logo image */}
          <TrainFront className="text-white" size={24} />
          {/* Once you have logo.png in public: <img src="/logo.png" className="w-full h-full object-cover" /> */}
        </div>
        <span className="font-black text-xl tracking-tighter uppercase leading-none italic">
          Choo Choo <br />
          <span className="text-red-500 not-italic">Tortas</span>
        </span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              isActive 
                ? "bg-red-600 text-white shadow-lg shadow-red-900/20" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-transform duration-200 group-hover:scale-110",
              "opacity-80"
            )} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span 
              onClick={logout}
              className="text-xs text-zinc-500 underline cursor-pointer hover:text-zinc-300 transition-colors"
            >
              Sign Out
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
