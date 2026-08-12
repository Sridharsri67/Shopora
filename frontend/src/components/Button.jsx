import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon: Icon
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium tracking-tight rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-xs sm:text-sm gap-2',
    lg: 'px-6 py-3.5 text-sm font-semibold gap-2.5',
  };

  const variants = {
    primary:
      'bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm active:scale-[0.98]',
    secondary:
      'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-200 active:scale-[0.98]',
    outline:
      'bg-transparent text-neutral-900 hover:bg-neutral-50 border border-neutral-900 active:scale-[0.98]',
    ghost:
      'bg-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 active:scale-[0.98]',
    danger:
      'bg-red-600 text-white hover:bg-red-700 shadow-sm active:scale-[0.98]',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </motion.button>
  );
}
