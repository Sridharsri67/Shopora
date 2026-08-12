import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductGrid from '../components/ProductGrid';
import { ArrowRight, Zap, ShieldCheck, Truck, Headphones } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const data = await getProducts({ limit: 4 });
      setFeaturedProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900/40 via-neutral-900 to-purple-950/40 border border-neutral-800 p-8 sm:p-16 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="max-w-xl space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Zap className="w-3.5 h-3.5" /> Next-Gen Tech Store MVP
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Premium Engineering Gear &amp; Workspace Tech.
          </h1>
          <p className="text-neutral-400 text-base">
            Discover curated Mechanical Keyboards, Ergonomic Gear, 4K Displays, and High-Performance Accessories.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/products"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 text-sm"
            >
              Browse Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="w-full max-w-sm aspect-square bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-2xl border border-neutral-800 p-6 flex items-center justify-center relative">
          <div className="text-center space-y-3">
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Shopora
            </div>
            <p className="text-xs text-neutral-400">Full-Stack E-Commerce Architecture</p>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Verified Payments</h4>
            <p className="text-xs text-neutral-400 mt-1">Stripe Checkout Session &amp; verified webhook processing.</p>
          </div>
        </div>

        <div className="p-6 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Real-time Stock</h4>
            <p className="text-xs text-neutral-400 mt-1">PostgreSQL &amp; Redis backed authoritative inventory validation.</p>
          </div>
        </div>

        <div className="p-6 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">BullMQ Email Queue</h4>
            <p className="text-xs text-neutral-400 mt-1">Asynchronous background worker email notifications.</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Featured Gear</h2>
            <p className="text-xs text-neutral-400 mt-1">Handpicked workspace essentials</p>
          </div>
          <Link to="/products" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>
    </div>
  );
}
