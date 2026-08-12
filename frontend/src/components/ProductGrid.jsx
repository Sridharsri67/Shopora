import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4 animate-pulse">
            <div className="aspect-square bg-neutral-100 rounded-2xl border border-neutral-200/60" />
            <div className="h-4 bg-neutral-100 rounded w-3/4" />
            <div className="h-3 bg-neutral-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 bg-neutral-50 border border-neutral-200/60 rounded-3xl p-8 space-y-2">
        <p className="text-neutral-900 font-semibold text-base">No products match your selection.</p>
        <p className="text-xs text-neutral-500 font-light">Try searching for a different keyword or clearing filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
