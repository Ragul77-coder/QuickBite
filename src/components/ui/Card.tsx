import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverable = true }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm transition-all duration-300
        ${hoverable ? 'hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700/80 hover:-translate-y-0.5' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
