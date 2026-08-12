import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />,
    info: <Info className="w-4 h-4 text-neutral-900 shrink-0" />,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl border border-neutral-800 flex items-center gap-3 max-w-sm"
      >
        {icons[type] || icons.info}
        <span className="flex-1">{message}</span>
        {onClose && (
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
