import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import Badge from './Badge';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const stock = product.inventory ? product.inventory.quantity : 0;
  const isOutOfStock = stock <= 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col justify-between"
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container with Hover Scale */}
        <div className="aspect-square bg-neutral-100 rounded-2xl overflow-hidden relative border border-neutral-200/80 mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="neutral">{product.category}</Badge>
          </div>

          {/* Stock Indicator */}
          {isOutOfStock && (
            <div className="absolute top-3 right-3">
              <Badge variant="error">Out of Stock</Badge>
            </div>
          )}

          {/* Quick Add Overlay Button on Hover */}
          {!isOutOfStock && (
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleAdd}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg transition-all ${
                  added
                    ? 'bg-emerald-800 text-white'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Added to Bag
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" /> Quick Add
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-1">
          <h3 className="font-semibold text-neutral-900 text-sm group-hover:text-neutral-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-neutral-500 line-clamp-1 font-light">
            {product.description}
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="font-bold text-sm text-neutral-900">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-[11px] text-neutral-400">
              {stock} in stock
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
