import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <span className="font-mono text-xl font-black tracking-widest text-white">SHOPORA</span>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Modern Commerce. Beautifully Simplified. Premium engineering tools &amp; minimalist workspace gear.
            </p>
          </div>

          {/* Catalog Column */}
          <div className="space-y-3 text-xs">
            <span className="font-semibold text-white uppercase tracking-wider block mb-2">Shop Catalog</span>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=Audio" className="hover:text-white transition-colors">Audio Equipment</Link></li>
              <li><Link to="/products?category=Monitors" className="hover:text-white transition-colors">4K Displays</Link></li>
              <li><Link to="/products?category=Accessories" className="hover:text-white transition-colors">Workspace Accessories</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3 text-xs">
            <span className="font-semibold text-white uppercase tracking-wider block mb-2">Account &amp; Orders</span>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">My Order History</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Account Settings</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Platform Architecture */}
          <div className="space-y-3 text-xs">
            <span className="font-semibold text-white uppercase tracking-wider block mb-2">Tech Specs</span>
            <p className="text-neutral-400 leading-relaxed font-mono text-[11px]">
              PostgreSQL • Prisma ORM • Redis Cache • BullMQ Queue • Stripe Payments • React 19 SPA
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>&copy; {new Date().getFullYear()} SHOPORA E-Commerce Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-neutral-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-300 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-300 transition-colors cursor-pointer">Stripe Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
