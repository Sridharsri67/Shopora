import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Check, Layers } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

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
    <div className="group bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all flex flex-col justify-between">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square bg-neutral-950 relative overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-md text-neutral-300 text-[11px] font-medium px-2.5 py-1 rounded-full border border-neutral-800">
            {product.category}
          </span>
          {isOutOfStock && (
            <span className="absolute top-3 right-3 bg-red-500/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-red-400/30">
              Out of Stock
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-neutral-400 mt-1 line-clamp-2 min-h-[32px]">
            {product.description}
          </p>
        </div>
      </Link>

      <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-neutral-800/60">
        <div>
          <div className="text-lg font-bold text-white">₹{product.price.toLocaleString()}</div>
          <div className="text-[11px] text-neutral-500 flex items-center gap-1">
            <Layers className="w-3 h-3 text-neutral-400" /> {stock} in stock
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isOutOfStock
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
              : added
              ? 'bg-emerald-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" /> Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}
