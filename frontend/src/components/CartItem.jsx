import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center justify-between p-4 bg-white border border-neutral-200/80 rounded-2xl gap-4 shadow-2xs"
    >
      <div className="flex items-center gap-4">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-xl bg-neutral-100 border border-neutral-200/60"
        />
        <div>
          <h4 className="font-semibold text-neutral-900 text-sm line-clamp-1">{item.name}</h4>
          <p className="text-xs text-neutral-500 font-light mt-0.5">₹{item.price.toLocaleString()} each</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl p-1">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-1 hover:bg-neutral-200/60 rounded-lg text-neutral-600 hover:text-neutral-900 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-semibold px-2 text-neutral-900">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1 hover:bg-neutral-200/60 rounded-lg text-neutral-600 hover:text-neutral-900 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-right min-w-[80px]">
          <div className="font-bold text-neutral-900 text-sm">
            ₹{(item.price * item.quantity).toLocaleString()}
          </div>
        </div>

        <button
          onClick={() => removeFromCart(item.id)}
          className="text-neutral-400 hover:text-red-600 p-1.5 transition-colors"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
