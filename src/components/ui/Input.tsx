import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label ? (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 ml-1">
            {label}
          </label>
        ) : null}
        
        <div className="relative flex items-center">
          {leftIcon ? (
            <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
              {leftIcon}
            </div>
          ) : null}
          
          <input
            ref={ref}
            type={type}
            className={`
              w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200
              ${leftIcon ? 'pl-11' : ''} 
              ${rightIcon ? 'pr-11' : ''} 
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800'}
              ${className}
            `}
            {...props}
          />
          
          {rightIcon ? (
            <div className="absolute right-3.5 text-slate-400 dark:text-slate-500 cursor-pointer">
              {rightIcon}
            </div>
          ) : null}
        </div>

        {error ? (
          <span className="block text-xs text-red-500 mt-1 ml-1">{error}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
