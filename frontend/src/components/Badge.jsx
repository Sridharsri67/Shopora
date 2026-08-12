import React from 'react';

export default function Badge({ children, variant = 'neutral', className = '' }) {
  const variants = {
    neutral: 'bg-neutral-100 text-neutral-800 border-neutral-200',
    dark: 'bg-neutral-900 text-white border-neutral-800',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/60',
    error: 'bg-red-50 text-red-800 border-red-200/60',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-wide ${
        variants[variant] || variants.neutral
      } ${className}`}
    >
      {children}
    </span>
  );
}
