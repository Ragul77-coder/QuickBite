import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'premium' | 'vegan';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const styles = {
    primary: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    premium: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm border border-transparent',
    vegan: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm border border-transparent',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold select-none ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
