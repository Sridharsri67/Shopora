import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductGrid from '../components/ProductGrid';
import PageTransition from '../components/PageTransition';
import { Search, Filter } from 'lucide-react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  const categories = ['All', 'Electronics', 'Audio', 'Monitors', 'Accessories'];

  useEffect(() => {
    fetchProducts();
  }, [category, searchParams]);

  const fetchProducts = async (searchQuery = search) => {
    setLoading(true);
    try {
      const data = await getProducts({
        search: searchQuery,
        category: category === 'All' ? '' : category,
      });
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (cat) => {
    const selected = cat === 'All' ? '' : cat;
    setCategory(selected);
    if (selected) {
      setSearchParams({ category: selected });
    } else {
      setSearchParams({});
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  return (
    <PageTransition>
      <div className="space-y-10 py-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 block mb-1">Catalog</span>
          <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">Shop All Gear</h1>
        </div>

        {/* Filter and Search controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-neutral-50 p-4 border border-neutral-200 rounded-2xl">
          {/* Monochrome Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <Filter className="w-4 h-4 text-neutral-400 shrink-0 mr-1" />
            {categories.map((cat) => {
              const isActive = (category === '' && cat === 'All') || category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-white text-neutral-600 border border-neutral-200 hover:text-neutral-900 hover:bg-neutral-100'
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
              placeholder="Search catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-neutral-200 text-neutral-900 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-neutral-900 transition-colors"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          </form>
        </div>

        <ProductGrid products={products} loading={loading} />
      </div>
    </PageTransition>
  );
}
