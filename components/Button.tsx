
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary', 
  disabled = false,
  fullWidth = false 
}: ButtonProps) => {
  const variants: Record<string, string> = {
    primary: 'bg-[#1cd991] text-white hover:opacity-90 disabled:bg-[#1cd991]/30 shadow-sm shadow-[#1cd991]/20',
    secondary: 'bg-white text-[#1cd991] border border-[#1cd991]/20 hover:bg-[#1cd991]/5',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600'
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-3 rounded-2xl transition-all font-bold flex items-center justify-center gap-2 active:scale-95 ${variants[variant as string]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};
