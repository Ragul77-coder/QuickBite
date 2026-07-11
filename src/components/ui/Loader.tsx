import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div
      className={`
        animate-spin rounded-full border-t-orange-500 border-r-transparent border-b-orange-500 border-l-transparent
        ${sizeClasses[size]}
      `}
      style={{ borderStyle: 'solid' }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm gap-4">
        {spinner}
        <p className="text-sm font-semibold tracking-wider text-orange-500 animate-pulse uppercase">
          Loading QuickBite...
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {spinner}
    </div>
  );
};
