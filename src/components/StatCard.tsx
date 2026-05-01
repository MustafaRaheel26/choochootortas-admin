import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendLabel, className }: StatCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 transition-transform duration-500 hover:rotate-12">
          <Icon size={24} />
        </div>
        {trend !== undefined && (
          <div className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            trend >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-zinc-500 text-sm font-medium">{title}</span>
        <span className="text-2xl font-bold text-zinc-900 mt-1">{value}</span>
        {trendLabel && <span className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider">{trendLabel}</span>}
      </div>
    </div>
  );
}
