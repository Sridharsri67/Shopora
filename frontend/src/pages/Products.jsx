import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import ProductGrid from '../components/ProductGrid';
import { Search, Filter } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = ['All', 'Electronics', 'Audio', 'Monitors', 'Accessories'];

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async (searchQuery = search) => {
    setLoading(true);
    try {
      const data = await getProducts({
        search: searchQuery,
        category: category === 'All' ? '' : category
      });
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Products</h1>
        <p className="text-sm text-neutral-400 mt-1">Browse our complete tech catalog</p>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-neutral-900/60 p-4 border border-neutral-800 rounded-2xl">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-neutral-400 shrink-0 mr-1" />
          {categories.map((cat) => {
            const isActive = (category === '' && cat === 'All') || category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat === 'All' ? '' : cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search keyboards, mice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
        </form>
      </div>

      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
