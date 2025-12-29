
import React from 'react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

export const Badge = ({ children, variant = 'primary', className = '' }: BadgeProps) => {
  const styles: Record<string, string> = {
    primary: 'bg-[#1cd991]/10 text-[#1cd991] border border-[#1cd991]/20',
    success: 'bg-emerald-100 text-emerald-700 border border-emerald-200/50',
    warning: 'bg-amber-100 text-amber-700 border border-amber-200/50',
    danger: 'bg-rose-100 text-rose-700 border border-rose-200/50',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/50'
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
