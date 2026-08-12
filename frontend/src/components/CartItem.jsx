import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl gap-4">
      <div className="flex items-center gap-4">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg bg-neutral-950"
        />
        <div>
          <h4 className="font-semibold text-white text-sm line-clamp-1">{item.name}</h4>
          <p className="text-xs text-neutral-400 mt-0.5">₹{item.price.toLocaleString()} each</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Quantity control */}
        <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg p-1">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-semibold px-2 text-white">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-right min-w-[80px]">
          <div className="font-bold text-white text-sm">
            ₹{(item.price * item.quantity).toLocaleString()}
          </div>
        </div>

        <button
          onClick={() => removeFromCart(item.id)}
          className="text-neutral-500 hover:text-red-400 p-1.5 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
