import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    rect: 'h-32 w-full rounded-2xl',
    circle: 'h-12 w-12 rounded-full',
  };

  return (
    <div
      className={`
        animate-skeleton bg-slate-200 dark:bg-slate-800
        ${variantStyles[variant]}
        ${className}
      `}
    />
  );
};
