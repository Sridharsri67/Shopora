import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductGrid from '../components/ProductGrid';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';
import { ArrowRight, ShieldCheck, Zap, Layers, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <PageTransition>
      <div className="space-y-24 py-8">
        {/* Luxury Hero Banner */}
        <section className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white p-8 sm:p-16 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 border border-neutral-800">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl space-y-8 text-center md:text-left"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest bg-white/10 text-neutral-300 border border-white/10">
              <Sparkles className="w-3 h-3" /> Editorial Collection 2026
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-none text-balance">
              The Future of Shopping. <span className="text-neutral-400 font-light italic">Everything. Simplified.</span>
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base font-light max-w-lg leading-relaxed">
              Curated Mechanical Keyboards, High-Performance Audio, 4K Ergonomic Displays, and Precision Desk Gear.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <Link to="/products">
                <Button variant="primary" size="lg" className="bg-white text-neutral-900 hover:bg-neutral-200">
                  Shop Collection <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/products?category=Electronics">
                <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 border border-white/20">
                  Explore Gear
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md aspect-square bg-gradient-to-tr from-neutral-800 to-neutral-900 rounded-3xl border border-neutral-800 p-8 flex items-center justify-center relative overflow-hidden shadow-2xl"
          >
            <div className="text-center space-y-4">
              <span className="font-mono text-5xl font-black tracking-widest text-white block">SHOPORA</span>
              <p className="text-xs text-neutral-400 font-light tracking-wide uppercase">Minimal • Luxury • Performance</p>
            </div>
          </motion.div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-neutral-50 border border-neutral-200/80 rounded-3xl space-y-3">
            <div className="w-10 h-10 bg-neutral-900 text-white rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-900 text-base">Verified Stripe Payments</h3>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Stripe Checkout Session &amp; real-time raw webhook fulfillment architecture.
            </p>
          </div>

          <div className="p-8 bg-neutral-50 border border-neutral-200/80 rounded-3xl space-y-3">
            <div className="w-10 h-10 bg-neutral-900 text-white rounded-2xl flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-900 text-base">Real-Time PostgreSQL Stock</h3>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Authoritative backend stock rules ensuring non-negative inventory levels.
            </p>
          </div>

          <div className="p-8 bg-neutral-50 border border-neutral-200/80 rounded-3xl space-y-3">
            <div className="w-10 h-10 bg-neutral-900 text-white rounded-2xl flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-neutral-900 text-base">BullMQ Background Queue</h3>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Asynchronous Redis email workers powering order confirmations off-thread.
            </p>
          </div>
        </section>

        {/* Featured Products Catalog */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Curated Catalog</span>
              <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">Featured Workspace Essentials</h2>
            </div>
            <Link to="/products" className="text-xs font-semibold text-neutral-900 hover:text-neutral-600 flex items-center gap-1">
              View All Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} loading={loading} />
        </section>

        {/* Customer Testimonials Strip */}
        <section className="bg-neutral-900 text-white rounded-3xl p-12 space-y-8 border border-neutral-800">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="flex justify-center text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <h3 className="text-2xl font-bold tracking-tight">"Engineered with extraordinary attention to detail."</h3>
            <p className="text-xs text-neutral-400 font-light">Verified Customer Feedback</p>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
